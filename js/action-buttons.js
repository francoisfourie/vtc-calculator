// Action buttons functionality
function setupActionButtons(csrfToken) {
    // Email button action
    $(document).on('click', '#captureAndEmail', function() {
        handleEmailAction(csrfToken);
    });
    
    // WhatsApp/download button action
    $(document).on('click', '#captureAndWhatsApp', function() {
        handleWhatsAppAction();
    });
    
    // Modal dismiss handlers
    $(document).on('click', '[data-bs-dismiss="modal"]', function() {
        var emailModal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
        if (emailModal) {
            emailModal.hide();
        }
    });
}

function handleEmailAction(csrfToken) {
    captureToPDF().then(pdf => {
        const pdfData = pdf.output('datauristring');
        
        console.log("PDF Data length:", pdfData.length);
        var emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
        emailModal.show();

        $("#sendEmailBtn").click(function() {
            const recipientEmail = $('#recipientEmail').val();
            if (!recipientEmail) {
                alert('Please enter a valid email address.');
                return;
            }
            $('#emailModal').modal('hide');
            $.ajax({
                url: 'email_sender.php',
                method: 'POST',
                data: {
                    csrf_token: csrfToken,
                    to: recipientEmail,
                    subject: 'PDF Capture',
                    message: 'Please find the PDF capture attached.',
                    pdf: pdfData
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        console.log('Email sent successfully');
                    } else {
                        console.error('Failed to send email:', response.message);
                        alert('Failed to send email: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX error:', status, error);
                    $('#emailModal').modal('hide');
                    alert('An error occurred while sending the email.');
                }
            });
        });
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF');
    });
}

function handleWhatsAppAction() {
    captureToPDF().then(pdf => {
        // Always save the PDF for testing purposes
        pdf.save("vtc.pdf");

        if (navigator.share) {
            const pdfBlob = pdf.output('blob');
            navigator.share({
                files: [new File([pdfBlob], 'vtc.pdf', { type: 'application/pdf' })],
                title: 'VTC Estimate',
                text: 'VTC Estimate'
            }).then(() => console.log('Shared successfully'))
              .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for devices that don't support Web Share API
            alert("Your device doesn't support direct sharing. The PDF has been saved, you can share it manually.");
        }
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF');
    });
}
