import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { SchedulerService } from 'src/app/settings/services/scheduler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulerJob, SchedulerJobType, SchedulerJobFact, SchedulerJobBaseline } from 'src/app/settings/interfaces/scheduler';
import { Icons } from 'src/app/shared/constants/icons';
import { FormBuilder, Validators } from '@angular/forms';
import { SchedulerBaselineCompositionComponent } from './scheduler-baseline-composition/scheduler-baseline-composition.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { FactCompositionComponent } from '../../fact/fact-composition/fact-composition.component';

@Component({
  selector: 'app-scheduler-edit',
  templateUrl: './scheduler-edit.component.html',
  styleUrls: ['./scheduler-edit.component.scss']
})
export class SchedulerEditComponent implements OnInit, OnDestroy {

  @ViewChild('factComposition', { static: false }) factComposition: FactCompositionComponent;
  @ViewChild('baselineComposition', { static: false }) baselineComposition: SchedulerBaselineCompositionComponent;

  public SchedulerJobType = SchedulerJobType;
  public icons = Icons;

  public creationMode: boolean;
  public schedulerId: number;
  public schedulerName: string;
  public scheduler: SchedulerJob;
  public isDirty = false;

  public formScheduler = this.formBuilder.group({
    id: [{ value: '', disabled: true }, Validators.required],
    name: ['', Validators.required],
    cronexpr: ['', Validators.required],
    jobtype: ['', Validators.required],
    recalcul: [false]
  });

  public schedulerJobFactForm = this.formBuilder.group({
    schedulerJobFactFrom: ['', Validators.required],
    schedulerJobFactTo: ['', Validators.required]
  });

  constructor(
    private headerService: HeaderService,
    private schedulerService: SchedulerService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.headerService.changeVisibility(false);
    this.creationMode = this.route.snapshot.data.creationMode;
    if (!this.creationMode) {
      this.route.params.subscribe((params) => {
        this.schedulerId = params.id;
        this.fetchScheduler(params.id);
      });
    } else {
      this.scheduler = { job: { factIds: [] } };
    }
  }

  private fetchScheduler(schedulerId: number) {
    this.schedulerService.read(schedulerId).subscribe((scheduler: SchedulerJob) => {
      this.scheduler = scheduler;
      this.schedulerName = scheduler.name;
      this.formScheduler.setValue({
        id: scheduler.id,
        name: scheduler.name,
        cronexpr: scheduler.cronexpr,
        jobtype: scheduler.jobtype,
        recalcul: this.schedulerIsRecalculated(scheduler)
      });
      this.isDirty = false;
      this.formScheduler.markAsPristine();
      if (this.schedulerIsRecalculated(scheduler)) {
        this.schedulerJobFactForm.setValue({
          schedulerJobFactFrom: (scheduler.job as SchedulerJobFact).to,
          schedulerJobFactTo: (scheduler.job as SchedulerJobFact).from
        });
      }
    });
  }

  private schedulerIsRecalculated(scheduler: SchedulerJob) {
    if (scheduler.jobtype === SchedulerJobType.Fact) {
      if ((scheduler.job as SchedulerJobFact).from && (scheduler.job as SchedulerJobFact).to) {
        return true;
      }
    }
    return false;
  }

  public cancel() {
    if (this.creationMode) {
      this.return();
      return;
    }
    this.fetchScheduler(this.schedulerId);
    this.factComposition ? this.factComposition.reset() : this.baselineComposition.reset();
    this.isDirty = false;
    this.formScheduler.markAsPristine();
    this.schedulerJobFactForm.markAsPristine();
  }

  public return() {
    this.router.navigate(['/settings/schedulers']);
  }

  public save() {
    if (this.formScheduler.invalid) {
      return;
    }
    const schedulerjob: SchedulerJob = this.convertFormToSchedulerJob();
    if (this.creationMode) {
      this.schedulerService.create(schedulerjob).subscribe((scheduler: SchedulerJob) => {
        this.return();
      });
    } else {
      this.schedulerService.update(this.schedulerId, schedulerjob).subscribe(() => {
        // this.wasValidated = false;
        this.isDirty = false;
        this.formScheduler.markAsPristine();
      });
    }
  }

  public getJob() {
    if (this.formScheduler.get('jobtype').value === SchedulerJobType.Fact) {
      return ({ factIds: [], ...this.scheduler.job } as SchedulerJobFact);
    }
    if (this.formScheduler.get('jobtype').value === SchedulerJobType.Baseline) {
      return ({ baselineIds: [], ...this.scheduler.job } as SchedulerJobBaseline);
    }
  }

  private getSchedulerJobFact(): SchedulerJobFact {
    if (this.formScheduler.get('recalcul').value) {
      return {
        factIds: this.factComposition.getFactIds(),
        from: this.schedulerJobFactForm.get('schedulerJobFactFrom').value,
        to: this.schedulerJobFactForm.get('schedulerJobFactTo').value
      };
    }
    return { factIds: this.factComposition.getFactIds() };
  }

  public convertFormToSchedulerJob(): SchedulerJob {
    const schedulerjob: SchedulerJob = {
      name: this.formScheduler.get('name').value,
      cronexpr: this.formScheduler.get('cronexpr').value,
      jobtype: this.formScheduler.get('jobtype').value,
      job: this.formScheduler.get('jobtype').value === SchedulerJobType.Fact ?
        this.getSchedulerJobFact() :
        { baselineIds: this.baselineComposition.getBaselineIds() }
    };
    return schedulerjob;
  }

  public formIsValid(): boolean {
    if (!this.formScheduler.dirty && !this.isDirty && !this.schedulerJobFactForm.dirty) {
      return false;
    }
    if (this.formScheduler.get('jobtype').value === SchedulerJobType.Fact) {
      if (this.formScheduler.get('recalcul').value && !this.schedulerJobFactForm.valid) {
        return false;
      }
      if (!this.factComposition) {
        return false;
      }
      const factSize = this.factComposition.getFactIds().length;
      return ((factSize > 0) && this.formScheduler.valid);
    }

    if (this.formScheduler.get('jobtype').value === SchedulerJobType.Baseline) {
      if (!this.baselineComposition) {
        return false;
      }
      const baselineSize = this.baselineComposition.getBaselineIds().length;
      return ((baselineSize > 0) && this.formScheduler.valid);
    }
    return false;
  }


  public delete() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.schedulerjob.component.deletewindow.title',
        content: 'settings.schedulerjob.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.schedulerService.delete(this.schedulerId).subscribe(() => {
          this.return();
          this.snackBar.open('MISSING', null, { duration: 2000 });
        });
      }
    });
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

}
