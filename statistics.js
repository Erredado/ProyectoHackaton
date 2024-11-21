document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('donationChart').getContext('2d');
    const donors = JSON.parse(localStorage.getItem('donors')) || [];

    // Calcular el total de donaciones por frecuencia
    const donationsByFrequency = donors.reduce((acc, donor) => {
        const { donationFrequency, donationAmount } = donor;
        if (!acc[donationFrequency]) {
            acc[donationFrequency] = 0;
        }
        acc[donationFrequency] += donationAmount;
        return acc;
    }, {});

    // Preparar datos para el gráfico
    const labels = Object.keys(donationsByFrequency);
    const data = Object.values(donationsByFrequency);

    // Crear el gráfico
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Donaciones por Frecuencia',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto Total de Donaciones ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Frecuencia de Donación'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Donaciones por Frecuencia'
                }
            }
        }
    });
});