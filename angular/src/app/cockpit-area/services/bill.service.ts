import { Injectable } from '@angular/core';
import { OrderListView } from 'app/shared/view-models/interfaces';
import * as jsPDF from 'jspdf';

@Injectable()
export class BillService {

    private currentDate: Date;

    constructor() {
        this.currentDate = new Date();
    }

    createBillAsPDF(selectedOrder: OrderListView) {
        const doc = new jsPDF.jsPDF();
        const docTitle = 'RE-' + selectedOrder.booking.bookingToken.toString().split('_')[2];

        const orderLines = selectedOrder.orderLines;
        let totalPrice = 0;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(35);

        doc.text([
            'MyThaiStar'
        ], 25, 30);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(15);

        doc.text([
            'Mehr als nur leckeres Essen'
        ], 25, 40);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);

        doc.text([
            'Rechnung'
        ], 110, 50);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        doc.text([
            'Rechnungsnummer'
        ], 110, 55);

        doc.text([
            'RE-' + selectedOrder.booking.bookingToken.toString().split('_')[2]
        ], 160, 55);

        doc.text([
            'Rechnungsdatum'
        ], 110, 60);

        doc.text([
            ("0" + this.currentDate.getDate()).slice(-2) + "." + ("0"+(this.currentDate.getMonth()+1)).slice(-2) + "." + this.currentDate.getFullYear()
        ], 160, 60);

        doc.text([
            'Tischnummer'
        ], 110, 65);

        doc.text([
            selectedOrder.booking.tableId.toString()
        ], 160, 65);

        doc.text([
            'Gast'
        ], 110, 70);

        doc.text([
            selectedOrder.booking.name
        ], 160, 70);

        doc.setFont('helvetica', 'bold');

        doc.text([
            'Nr.'
        ], 25, 90);

        doc.text([
            'Bezeichnung'
        ], 35, 90);

        doc.text([
            'Einzelpreis'
        ], 110, 90);

        doc.text([
            'Menge'
        ], 140, 90);

        doc.text([
            'Gesamtpreis'
        ], 160, 90);

        doc.line(25, 92, 180, 92);

        doc.setFont('helvetica', 'normal');

        // print position number
        for (let index = 0; index < orderLines.length; index++) {
            doc.text([
                (index + 1).toString()
            ], 25, 100 + (10 * index));
        }

        // print disch names
        for (let index = 0; index < orderLines.length; index++) {
            doc.text([
                orderLines[index].dish.name
            ], 35, 100 + (10 * index));
        }

        // print unit prices
        for (let index = 0; index < orderLines.length; index++) {
            doc.text([
                orderLines[index].dish.price.toString() + ' €'
            ], 110, 100 + (10 * index));
        }

        // print amount
        for (let index = 0; index < orderLines.length; index++) {
            doc.text([
                orderLines[index].orderLine.amount.toString()
            ], 140, 100 + (10 * index));
        }

        // print position price
        for (let index = 0; index < orderLines.length; index++) {
            doc.text([
                (orderLines[index].dish.price * orderLines[index].orderLine.amount).toString() + ' €'
            ], 160, 100 + (10 * index));
            totalPrice += orderLines[index].dish.price * orderLines[index].orderLine.amount;
        }

        doc.line(25, 95 + (10 * orderLines.length), 180, 95 + (10 * orderLines.length));

        doc.text([
            'Summe Positionen'
        ], 110, 105 + (10 * orderLines.length));

        doc.text([
            totalPrice.toString() +  ' €'
        ], 160, 105 + (10 * orderLines.length));

        doc.text([
            'davon MwSt. (19 %)'
        ], 110, 110 + (10 * orderLines.length));

        doc.text([
            ((totalPrice / 119) * 19).toFixed(2) + ' €'
        ], 160, 110 + (10 * orderLines.length));
        
        doc.text([
            'Rechnungssumme (Netto)'
        ], 110, 115 + (10 * orderLines.length));

        doc.text([
            (totalPrice - ((totalPrice / 119) * 19)).toFixed(2) + ' €'
        ], 160, 115 + (10 * orderLines.length));

        doc.line(25, 120 + (10 * orderLines.length), 180, 120 + (10 * orderLines.length));

        doc.setFont('helvetica', 'bold');

        doc.text([
            'Rechnungssumme'
        ], 110, 125 + (10 * orderLines.length));

        doc.text([
            totalPrice.toString() +  ' €'
        ], 160, 125 + (10 * orderLines.length));

        doc.save(docTitle);
    }    
}