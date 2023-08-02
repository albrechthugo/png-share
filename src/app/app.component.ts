import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('content', { static: true })
  private readonly contentRef!: ElementRef<HTMLElement>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  share(): void {
    from(html2canvas(this.contentRef.nativeElement)).subscribe((canvas) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.log('Error during blob generating');
            return;
          }

          const reader = new FileReader();

          reader.onloadend = () => {
            const data = { url: reader.result as string };

            if (!this.document.defaultView?.navigator.canShare(data)) {
              console.error('share api not supported here!');
              return;
            }

            this.document.defaultView?.navigator.share(data);
          };

          reader.readAsDataURL(blob);
        },
        'image/png',
        1.0
      );
    });
  }
}
