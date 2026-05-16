document.addEventListener('DOMContentLoaded', () => {
    // Enterprise Indigo Palette
    const colors = {
        primary: '#4F46E5',
        accent: '#F97316',
        success: '#10B981',
        danger: '#EF4444',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB'
    };

    // Revenue Forecast Chart
    const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
    const revenueGradient = ctxRevenue.createLinearGradient(0, 0, 0, 400);
    revenueGradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    revenueGradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    new Chart(ctxRevenue, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [32000, 38000, 35000, 42000, 48000, 45000, 52000, 58000, 55000, 62000, 68000, 72000],
                borderColor: colors.primary,
                borderWidth: 3,
                fill: true,
                backgroundColor: revenueGradient,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: colors.primary,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#fff',
                    titleColor: colors.textPrimary,
                    bodyColor: colors.textSecondary,
                    borderColor: colors.border,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: colors.textSecondary, font: { size: 12 } }
                },
                y: {
                    grid: { color: colors.border, drawBorder: false, borderDash: [5, 5] },
                    ticks: { color: colors.textSecondary, font: { size: 12 }, callback: (value) => '$' + (value / 1000) + 'k' }
                }
            }
        }
    });

    // Category Distribution Chart
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Fashion', 'Home', 'Beauty'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [colors.primary, colors.accent, colors.success, '#F3F4F6'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: '600' },
                        color: colors.textSecondary
                    }
                }
            }
        }
    });

    // Populate Transactions Table
    const transactions = [
        { id: '#ORD-7721', customer: 'Sarah Jenkins', product: 'Wireless Headphones', amount: '$249.00', status: 'Completed', date: 'May 16, 2026' },
        { id: '#ORD-7720', customer: 'Michael Chen', product: 'Mechanical Keyboard', amount: '$159.00', status: 'Pending', date: 'May 15, 2026' },
        { id: '#ORD-7719', customer: 'Emma Wilson', product: 'Smart Watch', amount: '$329.00', status: 'Completed', date: 'May 15, 2026' },
        { id: '#ORD-7718', customer: 'David Miller', product: 'Laptop Stand', amount: '$89.00', status: 'Completed', date: 'May 14, 2026' },
        { id: '#ORD-7717', customer: 'Lisa Thompson', product: 'USB-C Hub', amount: '$59.00', status: 'Completed', date: 'May 14, 2026' }
    ];

    const tableBody = document.getElementById('transactionTable');
    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600; color: var(--primary-brand);">${tx.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--secondary-bg); font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700;">${tx.customer.charAt(0)}</div>
                    ${tx.customer}
                </div>
            </td>
            <td>${tx.product}</td>
            <td style="font-weight: 700;">${tx.amount}</td>
            <td><span class="status-badge status-${tx.status.toLowerCase()}">${tx.status}</span></td>
            <td style="color: var(--text-secondary);">${tx.date}</td>
        `;
        tableBody.appendChild(row);
    });

    // GSAP Animations
    gsap.from('.sidebar', { x: -100, opacity: 0, duration: 1, ease: 'power4.out' });
    gsap.from('.top-header', { y: -50, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out' });
    gsap.from('.kpi-card', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.4, ease: 'power3.out' });
    gsap.from('.chart-card', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.6, ease: 'power3.out' });
    gsap.from('.data-table-container', { y: 30, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
});
