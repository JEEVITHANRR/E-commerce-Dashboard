/**
 * LuxeCommerce Intelligence - Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE DATA & CHARTS
    initDashboard();
    
    // 2. ENTRANCE ANIMATIONS (GSAP)
    animateEntrance();
});

function initDashboard() {
    initSalesChart();
    initCategoryChart();
    setupTableInteractions();
}

function animateEntrance() {
    gsap.from(".nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".sidebar", { x: -300, opacity: 0, duration: 1.2, delay: 0.2, ease: "power4.out" });
    gsap.from(".hero-h1, .sec-lbl, p", { 
        y: 30, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        delay: 0.5, 
        ease: "power3.out" 
    });
    gsap.from(".kpi", { 
        scale: 0.9, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        delay: 0.8, 
        ease: "back.out(1.7)" 
    });
    gsap.from(".card", { 
        y: 40, 
        opacity: 0, 
        stagger: 0.2, 
        duration: 1, 
        delay: 1, 
        ease: "power3.out" 
    });
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(91, 61, 245, 0.2)');
    gradient.addColorStop(1, 'rgba(91, 61, 245, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#5B3DF5',
                borderWidth: 4,
                pointBackgroundColor: '#5B3DF5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1F2937',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: { color: '#6B7280', font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 12 } }
                }
            }
        }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Apparel', 'Accessories', 'Electronics', 'Home'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#5B3DF5', '#FF6B6B', '#E7EAF3', '#1F2937'],
                borderWidth: 0,
                hoverOffset: 20
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
                        padding: 20,
                        usePointStyle: true,
                        font: { size: 12, weight: '600' }
                    }
                }
            }
        }
    });
}

function setupTableInteractions() {
    const rows = document.querySelectorAll('.data-row');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            gsap.to(row, { scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)", duration: 0.3 });
        });
        row.addEventListener('mouseleave', () => {
            gsap.to(row, { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.4)", duration: 0.3 });
        });
    });
}

