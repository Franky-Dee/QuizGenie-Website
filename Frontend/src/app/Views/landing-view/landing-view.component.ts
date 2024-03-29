import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'fbw-landing-view',
  templateUrl: './landing-view.component.html',
  styleUrls: ['./landing-view.component.css']
})
export class LandingViewComponent {
  userInput: string = '';
  generatedText: string = '';
  apiUrl: string = 'http://localhost:5000/api/process-text';
  pressedScrollButton: boolean = false;
  isLoading: boolean = false;
  userScrollManually: boolean = false;
  showHelpMessage: boolean = false;

  constructor(private http: HttpClient) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        this.userScrollManually = true;
      }
    });
  }

  sendUserInput(): void {
    this.isLoading = true;
    const requestBody = {
      user_text: this.userInput
    };

    this.http.post<any>(this.apiUrl, requestBody).subscribe(
      (response) => {
        console.log(response);
        this.generatedText = response.generated_text;
        console.log(this.generatedText);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  async generatePDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([598, 842]);
    page.drawText(this.generatedText, {
      x: 5,
      y: 800,
      size: 8,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    this.downloadPDF(pdfBytes);
  }

  downloadPDF(pdfBytes: Uint8Array) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_multiple_choice_quiz.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
    this.pressedScrollButton = true;
  }

  toggleHelpMessage() {
    this.showHelpMessage = !this.showHelpMessage;
  }

  
}
