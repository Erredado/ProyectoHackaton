document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('donationChart').getContext('2d');
    const donorListByProject = document.getElementById('donorListByProject');
    const donors = JSON.parse(localStorage.getItem('donors')) || [];

    // Calcular el total de donaciones por proyecto
    const donationsByProject = donors.reduce((acc, donor) => {
        const project = donor.project || 'Sin especificar';
        if (!acc[project]) {
            acc[project] = {
                total: 0,
                donors: []
            };
        }
        acc[project].total += donor.donationAmount;
        acc[project].donors.push({
            name: donor.fullName,
            amount: donor.donationAmount
        });
        return acc;
    }, {});

    // Calcular el total de todas las donaciones
    const totalDonations = Object.values(donationsByProject).reduce((sum, project) => sum + project.total, 0);

    // Preparar datos para el gráfico
    const labels = Object.keys(donationsByProject);
    const data = labels.map(project => donationsByProject[project].total);
    const percentages = data.map(amount => ((amount / totalDonations) * 100).toFixed(2));

    // Crear el gráfico
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Porcentaje de Donaciones por Proyecto'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const percentage = percentages[context.dataIndex];
                            label += `$${value.toFixed(2)} (${percentage}%)`;
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Mostrar lista de donantes por proyecto
    Object.entries(donationsByProject).forEach(([project, data]) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-donors';
        const projectTotal = data.total;
        const projectPercentage = ((projectTotal / totalDonations) * 100).toFixed(2);

        projectElement.innerHTML = `
            <h3>${project} - $${projectTotal.toFixed(2)} (${projectPercentage}%)</h3>
            <ul>
                ${data.donors.map(donor => `<li>${donor.name}: $${donor.amount.toFixed(2)}</li>`).join('')}
            </ul>
        `;
        donorListByProject.appendChild(projectElement);
    });
});