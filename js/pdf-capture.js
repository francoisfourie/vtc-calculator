// PDF capture functionality
function captureToPDF() {
    return new Promise((resolve, reject) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const content = document.getElementById("maintab");

        // Fetch the HTML template
        fetch('pdf_template.html')
            .then(response => response.text())
            .then(template => {
                // Create a temporary div to hold the template
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = template;

                // Find the content div in the template
                const contentDiv = tempDiv.querySelector('.content');
                if (contentDiv) {
                    // Insert the captured content into the template
                    contentDiv.innerHTML = content.innerHTML;
                }

                // Generate PDF from the modified template
                doc.html(tempDiv, {
                    callback: function (doc) {
                        // Check the number of pages and remove extra pages
                        const totalPages = doc.internal.getNumberOfPages();
                        if (totalPages > 1) {
                            for (let i = totalPages; i > 1; i--) {
                                doc.deletePage(i);
                            }
                        }

                        // Resolve the promise with the PDF document
                        resolve(doc);
                    },
                    x: 10,
                    y: 10,
                    width: 190, // Adjust as needed
                    windowWidth: 1000 // Use a fixed width for consistency
                });
            })
            .catch(error => {
                console.error('Error loading template:', error);
                reject(error);
            });
    });
}
