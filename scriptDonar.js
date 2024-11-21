document.addEventListener('DOMContentLoaded', function() {
    const donorForm = document.getElementById('donorForm');
    const donorsList = document.getElementById('donorsList');
    const exportBtn = document.getElementById('exportBtn');
    const statisticsBtn = document.getElementById('statisticsBtn');
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    let editIndex = -1;

    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!value) {
            errorElement.textContent = 'Este campo es requerido';
            return false;
        }
        
        if (field.id === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            errorElement.textContent = 'Por favor, ingrese un email válido';
            return false;
        }
        
        if (field.id === 'donationAmount' && value <= 0) {
            errorElement.textContent = 'El monto debe ser mayor que cero';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }

    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const idNumber = document.getElementById('idNumber');
        const project = document.getElementById('project');
        const paymentMethod = document.getElementById('paymentMethod');
        const donationAmount = document.getElementById('donationAmount');
        const donationFrequency = document.getElementById('donationFrequency');
        const message = document.getElementById('message');
        
        const fields = [fullName, email, idNumber, project, paymentMethod, donationAmount, donationFrequency];
        
        if (fields.every(validateField)) {
            const donor = {
                fullName: fullName.value,
                email: email.value,
                idNumber: idNumber.value,
                project: project.value,
                paymentMethod: paymentMethod.value,
                donationAmount: parseFloat(donationAmount.value),
                donationFrequency: donationFrequency.value,
                message: message.value
            };
            
            if (editIndex === -1) {
                donors.push(donor);
                showNotification('Donante agregado exitosamente', 'success');
            } else {
                donors[editIndex] = donor;
                editIndex = -1;
                showNotification('Donante actualizado exitosamente', 'success');
            }
            
            localStorage.setItem('donors', JSON.stringify(donors));
            donorForm.reset();
            displayDonors();
        }
    });

    function displayDonors() {
        donorsList.innerHTML = '';
        donors.forEach((donor, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donor.idNumber}</td>
                <td>${donor.fullName}</td>
                <td>${donor.email}</td>
                <td>${donor.project}</td>
                <td>$${donor.donationAmount.toFixed(2)}</td>
                <td>${donor.donationFrequency}</td>
                <td>
                    <button onclick="editDonor(${index})">Editar</button>
                    <button onclick="deleteDonor(${index})">Eliminar</button>
                </td>
            `;
            donorsList.appendChild(row);
        });
    }

    window.editDonor = function(index) {
        const donor = donors[index];
        document.getElementById('fullName').value = donor.fullName;
        document.getElementById('email').value = donor.email;
        document.getElementById('idNumber').value = donor.idNumber;
        document.getElementById('project').value = donor.project;
        document.getElementById('paymentMethod').value = donor.paymentMethod;
        document.getElementById('donationAmount').value = donor.donationAmount;
        document.getElementById('donationFrequency').value = donor.donationFrequency;
        document.getElementById('message').value = donor.message;

        editIndex = index;
        document.querySelector('button[type="submit"]').textContent = 'Actualizar Donante';
    }

    window.deleteDonor = function(index) {
        if (confirm('¿Está seguro de que desea eliminar este donante?')) {
            donors.splice(index, 1);
            localStorage.setItem('donors', JSON.stringify(donors));
            displayDonors();
            showNotification('Donante eliminado exitosamente', 'success');
        }
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }

    exportBtn.addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Nombre,Email,Proyecto,Monto,Frecuencia,Método de Pago,Mensaje\n"
            + donors.map(d => `${d.idNumber},${d.fullName},${d.email},${d.project},${d.donationAmount},${d.donationFrequency},${d.paymentMethod},"${d.message}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "donantes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    statisticsBtn.addEventListener('click', () => {
        window.location.href = 'statistics.html';
    });

    displayDonors();
});