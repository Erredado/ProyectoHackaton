document.addEventListener('DOMContentLoaded', () => {
    let navbar = document.querySelector('.navbar');
    let menuBtn = document.querySelector('#menu-btn');

    menuBtn.onclick = () => {
        navbar.classList.toggle('active');
    }

    window.onscroll = () => {
        navbar.classList.remove('active');
    }

    // Donor form functionality
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        const donorTable = document.getElementById('donorTable').getElementsByTagName('tbody')[0];
        const notification = document.getElementById('notification');
        const exportBtn = document.getElementById('exportBtn');
        const statisticsBtn = document.getElementById('statisticsBtn');

        // Cargar datos guardados
        loadDonors();

        // Validación en tiempo real
        const inputs = donorForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
        });

        donorForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!validateForm()) return; // Detener si hay errores

            const donor = getDonorDataFromForm();
            saveDonor(donor);
            updateDonorTable();
            donorForm.reset();
            showNotification('Donante guardado exitosamente', 'success');
        });

        function getDonorDataFromForm() {
            return {
                idNumber: document.getElementById('idNumber').value.trim(),
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                birthDate: document.getElementById('birthDate').value,
                password: document.getElementById('password').value,
                paymentMethod: document.getElementById('paymentMethod').value,
                donationAmount: parseFloat(document.getElementById('donationAmount').value),
                donationFrequency: document.getElementById('donationFrequency').value,
                message: document.getElementById('message').value.trim(),
            };
        }

        function validateField(input) {
            const errorElement = document.getElementById(`${input.id}Error`);
            if (!errorElement) return true;

            let isValid = true;
            let errorMessage = '';

            switch (input.id) {
                case 'idNumber':
                    isValid = /^\d+$/.test(input.value.trim());
                    errorMessage = 'El número de identificación debe contener solo números.';
                    break;
                case 'fullName':
                    isValid = input.value.trim().length >= 3;
                    errorMessage = 'El nombre completo debe tener al menos 3 caracteres.';
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
                    errorMessage = 'El correo electrónico no es válido.';
                    break;
                case 'phone':
                    isValid = /^\d{7,15}$/.test(input.value.trim());
                    errorMessage = 'El número de teléfono debe contener entre 7 y 15 dígitos.';
                    break;
                case 'address':
                    isValid = input.value.trim().length >= 5;
                    errorMessage = 'La dirección debe tener al menos 5 caracteres.';
                    break;
                case 'birthDate':
                    const birthDate = new Date(input.value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    isValid = (age > 18 || (age === 18 && m >= 0));
                    errorMessage = 'Debes ser mayor de 18 años para registrarte.';
                    break;
                case 'password':
                    isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input.value);
                    errorMessage = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.';
                    break;
                case 'paymentMethod':
                case 'donationFrequency':
                    isValid = input.value !== '';
                    errorMessage = 'Por favor, seleccione una opción.';
                    break;
                case 'donationAmount':
                    isValid = parseFloat(input.value) > 0;
                    errorMessage = 'El monto de la donación debe ser mayor que cero.';
                    break;
                case 'message':
                    // El mensaje es opcional, así que siempre es válido
                    isValid = true;
                    break;
            }

            if (!isValid) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                input.classList.add('invalid');
            } else {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                input.classList.remove('invalid');
            }

            return isValid;
        }

        function validateForm() {
            let isValid = true;
            const inputs = donorForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            return isValid;
        }

        function saveDonor(donor) {
            const donors = JSON.parse(localStorage.getItem('donors')) || [];
            const existingDonorIndex = donors.findIndex((d) => d.idNumber === donor.idNumber);
            if (existingDonorIndex >= 0) {
                donors[existingDonorIndex] = donor; // Actualizar
            } else {
                donors.push(donor); // Agregar nuevo
            }
            localStorage.setItem('donors', JSON.stringify(donors));
        }

        function loadDonors() {
            updateDonorTable();
        }

        function updateDonorTable() {
            const donors = JSON.parse(localStorage.getItem('donors')) || [];
            donorTable.innerHTML = '';
            donors.forEach((donor) => {
                const row = donorTable.insertRow();
                row.innerHTML = `
                    <td>${donor.idNumber}</td>
                    <td>${donor.fullName}</td>
                    <td>${donor.email}</td>
                    <td>$${donor.donationAmount.toFixed(2)}</td>
                    <td>${donor.donationFrequency}</td>
                    <td>
                        <button class="edit" data-id="${donor.idNumber}"><i class="fas fa-edit"></i></button>
                        <button class="delete" data-id="${donor.idNumber}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                row.classList.add('fade-in');
            });

            // Agregar event listeners para editar y eliminar
            donorTable.addEventListener('click', (event) => {
                const target = event.target.closest('button');
                if (!target) return;

                const id = target.dataset.id;
                if (target.classList.contains('delete')) {
                    deleteDonor(id);
                } else if (target.classList.contains('edit')) {
                    editDonor(id);
                }
            });
        }

        function deleteDonor(id) {
            let donors = JSON.parse(localStorage.getItem('donors')) || [];
            donors = donors.filter((donor) => donor.idNumber !== id);
            localStorage.setItem('donors', JSON.stringify(donors));
            updateDonorTable();
            showNotification('Donante eliminado exitosamente', 'success');
        }

        function editDonor(id) {
            const donors = JSON.parse(localStorage.getItem('donors')) || [];
            const donor = donors.find((d) => d.idNumber === id);
            if (donor) {
                document.getElementById('idNumber').value = donor.idNumber;
                document.getElementById('fullName').value = donor.fullName;
                document.getElementById('email').value = donor.email;
                document.getElementById('phone').value = donor.phone;
                document.getElementById('address').value = donor.address;
                document.getElementById('birthDate').value = donor.birthDate;
                document.getElementById('password').value = donor.password;
                document.getElementById('paymentMethod').value = donor.paymentMethod;
                document.getElementById('donationAmount').value = donor.donationAmount;
                document.getElementById('donationFrequency').value = donor.donationFrequency;
                document.getElementById('message').value = donor.message;

                // Forzar la validación de los campos
                const inputs = donorForm.querySelectorAll('input, select, textarea');
                inputs.forEach(validateField);

                // Cambiar el texto del botón de envío
                document.querySelector('button[type="submit"]').textContent = 'Actualizar Donante';
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

        // Exportar lista de donantes
        exportBtn.addEventListener('click', () => {
            const donors = JSON.parse(localStorage.getItem('donors')) || [];
            const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Nombre,Email,Monto,Frecuencia\n"
                + donors.map(d => `${d.idNumber},${d.fullName},${d.email},${d.donationAmount},${d.donationFrequency}`).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "donantes.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Ver estadísticas
        statisticsBtn.addEventListener('click', () => {
            window.location.href = 'statistics.html';
        });
    }
});