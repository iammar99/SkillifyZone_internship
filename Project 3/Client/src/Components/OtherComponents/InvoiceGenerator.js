import jsPDF from 'jspdf';
import { message } from 'antd';

// Fixed Invoice generator function - Text only, no images
export const generateInvoice = async (order) => {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        let yPosition = margin;

        const orderId = String(order._id).slice(-8);
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const invoiceDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Helper function to check if we need a new page
        const checkNewPage = (requiredSpace = 10) => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };

        // Helper function to add text with automatic line wrapping
        const addText = (text, x, y, options = {}) => {
            const fontSize = options.fontSize || 10;
            const fontStyle = options.fontStyle || 'normal';
            const align = options.align || 'left';
            
            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', fontStyle);
            
            if (options.maxWidth) {
                const lines = pdf.splitTextToSize(text, options.maxWidth);
                for (let i = 0; i < lines.length; i++) {
                    checkNewPage();
                    pdf.text(lines[i], x, y + (i * fontSize * 0.5), { align: align });
                    y += fontSize * 0.5;
                }
                return y + 5;
            } else {
                checkNewPage();
                pdf.text(text, x, y, { align: align });
                return y + fontSize * 0.5 + 2;
            }
        };

        // Company Header
        yPosition = addText('LUXEFITS', margin, yPosition, { 
            fontSize: 24, 
            fontStyle: 'bold' 
        });
        yPosition = addText('123 Business Street, City, State 12345', margin, yPosition);
        yPosition = addText('Phone: (555) 123-4567 | Email: info@luxefits.com', margin, yPosition);
        
        yPosition += 10;

        // Invoice Title and Info
        yPosition = addText('INVOICE', pageWidth - margin, yPosition, { 
            fontSize: 20, 
            fontStyle: 'bold',
            align: 'right'
        });
        yPosition = addText(`Invoice #: INV-${orderId}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition = addText(`Order #: ${orderId}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition = addText(`Invoice Date: ${invoiceDate}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition = addText(`Order Date: ${orderDate}`, pageWidth - margin, yPosition, { align: 'right' });

        yPosition += 15;
        checkNewPage(40);

        // Bill To and Ship To sections
        const midPoint = pageWidth / 2;
        
        // Bill To
        let billToY = yPosition;
        billToY = addText('BILL TO:', margin, billToY, { fontStyle: 'bold', fontSize: 12 });
        billToY = addText(`${order.billingInfo.firstName} ${order.billingInfo.lastName}`, margin, billToY, { fontStyle: 'bold' });
        billToY = addText(order.billingInfo.address, margin, billToY, { maxWidth: midPoint - margin - 10 });
        billToY = addText(`${order.billingInfo.city}, ${order.billingInfo.state} ${order.billingInfo.zipCode}`, margin, billToY);
        billToY = addText(order.billingInfo.country, margin, billToY);

        // Ship To
        let shipToY = yPosition;
        shipToY = addText('SHIP TO:', midPoint, shipToY, { fontStyle: 'bold', fontSize: 12 });
        shipToY = addText(`${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`, midPoint, shipToY, { fontStyle: 'bold' });
        shipToY = addText(order.shippingInfo.address, midPoint, shipToY, { maxWidth: midPoint - 10 });
        shipToY = addText(`${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`, midPoint, shipToY);
        shipToY = addText(order.shippingInfo.country, midPoint, shipToY);
        shipToY = addText(`Phone: ${order.shippingInfo.phone}`, midPoint, shipToY);
        shipToY = addText(`Email: ${order.shippingInfo.email}`, midPoint, shipToY);

        yPosition = Math.max(billToY, shipToY) + 15;
        checkNewPage(50);

        // Items Header
        pdf.setDrawColor(0, 0, 0);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;

        yPosition = addText('Item Description', margin, yPosition, { fontStyle: 'bold' });
        yPosition = addText('Qty', pageWidth - 140, yPosition - 12, { fontStyle: 'bold' });
        yPosition = addText('Unit Price', pageWidth - 100, yPosition - 12, { fontStyle: 'bold' });
        yPosition = addText('Total', pageWidth - margin, yPosition - 12, { fontStyle: 'bold', align: 'right' });

        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Items
        order.items.forEach((orderItem) => {
            checkNewPage(15);
            
            const item = orderItem.id;
            const itemTotal = (parseFloat(item?.price || 0) * orderItem.quantity).toFixed(2);
            
            let itemY = yPosition;
            
            // Item description with attributes
            let itemDescription = item?.name || 'Product Name';
            if (item?.color) itemDescription += `\nColor: ${item.color}`;
            if (item?.size) itemDescription += `\nSize: ${item.size}`;
            
            itemY = addText(itemDescription, margin, itemY, { maxWidth: pageWidth - 180 });
            
            // Quantity, Price, Total (aligned to the first line of description)
            addText(orderItem.quantity.toString(), pageWidth - 140, yPosition);
            addText(`$${item?.price || '0.00'}`, pageWidth - 100, yPosition);
            addText(`$${itemTotal}`, pageWidth - margin, yPosition, { align: 'right' });
            
            yPosition = Math.max(itemY, yPosition + 15);
        });

        yPosition += 10;
        checkNewPage(40);

        // Totals section
        pdf.line(pageWidth - 120, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        yPosition = addText('Subtotal:', pageWidth - 80, yPosition);
        addText(`$${order.subtotal}`, pageWidth - margin, yPosition - 12, { align: 'right' });

        yPosition = addText('Tax:', pageWidth - 80, yPosition);
        addText(`$${order.tax}`, pageWidth - margin, yPosition - 12, { align: 'right' });

        pdf.line(pageWidth - 120, yPosition + 2, pageWidth - margin, yPosition + 2);
        yPosition += 8;

        yPosition = addText('TOTAL:', pageWidth - 80, yPosition, { fontStyle: 'bold', fontSize: 12 });
        addText(`$${order.total}`, pageWidth - margin, yPosition - 15, { align: 'right', fontStyle: 'bold', fontSize: 12 });

        yPosition += 15;
        checkNewPage(30);

        // Payment Information
        yPosition = addText('PAYMENT INFORMATION:', margin, yPosition, { fontStyle: 'bold', fontSize: 12 });
        yPosition = addText(`Payment Method: ${order.paymentInfo.paymentMethod === 'card' ? 'Credit Card' : order.paymentInfo.paymentMethod}`, margin, yPosition);
        yPosition = addText(`Card: ****-****-****-${order.paymentInfo.cardNumber.slice(-4)}`, margin, yPosition);
        yPosition = addText(`Cardholder: ${order.paymentInfo.nameOnCard}`, margin, yPosition);

        yPosition += 15;
        checkNewPage(25);

        // Footer
        yPosition = addText('Thank you for your business! If you have any questions about this invoice,', margin, yPosition, { maxWidth: maxWidth });
        yPosition = addText('please contact us at info@luxefits.com or (555) 123-4567.', margin, yPosition, { maxWidth: maxWidth });
        yPosition += 5;
        yPosition = addText('Terms & Conditions: Payment is due within 30 days. Late payments may be subject to a service charge.', margin, yPosition, { 
            maxWidth: maxWidth,
            fontSize: 9
        });

        // Download the PDF
        pdf.save(`LuxeFits-Invoice-${orderId}.pdf`);
        message.success('Invoice downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating invoice:', error);
        message.error('Error generating invoice. Please try again.');
    }
};

// Alternative simple invoice generator (if you prefer a more basic layout)
export const generateSimpleInvoice = async (order) => {
    try {
        const pdf = new jsPDF();
        const margin = 20;
        let y = margin;
        
        const orderId = String(order._id).slice(-8);
        
        // Header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('LUXEFITS INVOICE', margin, y);
        
        y += 20;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Invoice #: INV-${orderId}`, margin, y);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 120, y);
        
        y += 30;
        
        // Customer Info
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bill To:', margin, y);
        y += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`, margin, y);
        y += 8;
        pdf.text(order.shippingInfo.address, margin, y);
        y += 8;
        pdf.text(`${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`, margin, y);
        
        y += 30;
        
        // Items
        pdf.setFont('helvetica', 'bold');
        pdf.text('Items:', margin, y);
        y += 15;
        
        pdf.setFont('helvetica', 'normal');
        order.items.forEach((orderItem) => {
            const item = orderItem.id;
            const itemTotal = (parseFloat(item?.price || 0) * orderItem.quantity).toFixed(2);
            
            pdf.text(`${item?.name || 'Product'}`, margin, y);
            pdf.text(`Qty: ${orderItem.quantity}`, 120, y);
            pdf.text(`$${itemTotal}`, 160, y);
            y += 8;
        });
        
        y += 20;
        
        // Totals
        pdf.text(`Subtotal: $${order.subtotal}`, 120, y);
        y += 8;
        pdf.text(`Tax: $${order.tax}`, 120, y);
        y += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Total: $${order.total}`, 120, y);
        
        pdf.save(`Invoice-${orderId}.pdf`);
        message.success('Invoice downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating invoice:', error);
        message.error('Error generating invoice. Please try again.');
    }
};