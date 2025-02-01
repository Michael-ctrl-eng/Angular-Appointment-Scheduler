import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AppointmentPopoverComponent } from './appointment-popover/appointment-popover.component';
import { CalendarEvent } from 'angular-calendar';
import { ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private injector: Injector
  ) { }

  private popoverOverlayRef: OverlayRef | null = null;

  openPopover(event: CalendarEvent, elementRef: ElementRef): OverlayRef {
    if (this.popoverOverlayRef) {
      this.closePopover();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ]);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    this.popoverOverlayRef = this.overlay.create(overlayConfig);

    const popoverPortal = new ComponentPortal(
      AppointmentPopoverComponent,
      null,
      this.createInjector(event)
    );

    this.popoverOverlayRef.attach(popoverPortal);

    this.popoverOverlayRef.backdropClick().subscribe(() => this.closePopover());

    return this.popoverOverlayRef;
  }

  closePopover(): void {
    if (this.popoverOverlayRef) {
      this.popoverOverlayRef.detach();
      this.popoverOverlayRef.dispose();
      this.popoverOverlayRef = null;
    }
  }

  private createInjector(event: CalendarEvent): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: CalendarEvent, useValue: event }
      ]
    });
  }
}
