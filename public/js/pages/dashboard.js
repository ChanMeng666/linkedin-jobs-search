/**
 * Dashboard Page JavaScript
 * Simulates user statistics and manages saved jobs
 */

// Simulate loading user statistics
function loadDashboardStats() {
  // Get stats from localStorage or generate random data
  const stats = {
    totalSearches: localStorage.getItem('totalSearches') || Math.floor(Math.random() * 50) + 10,
    savedJobs: localStorage.getItem('savedJobs') || Math.floor(Math.random() * 15) + 5,
    apiCalls: localStorage.getItem('apiCalls') || Math.floor(Math.random() * 200) + 50,
    thisMonth: localStorage.getItem('thisMonth') || Math.floor(Math.random() * 30) + 5
  };

  // Update DOM
  document.getElementById('totalSearches').textContent = stats.totalSearches;
  document.getElementById('savedJobs').textContent = stats.savedJobs;
  document.getElementById('apiCalls').textContent = stats.apiCalls;
  document.getElementById('thisMonth').textContent = stats.thisMonth;

  // Animate numbers on load
  animateValue('totalSearches', 0, stats.totalSearches, 1000);
  animateValue('savedJobs', 0, stats.savedJobs, 1000);
  animateValue('apiCalls', 0, stats.apiCalls, 1000);
  animateValue('thisMonth', 0, stats.thisMonth, 1000);
}

// Animate number counting
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();

  // Add click handlers for timeline buttons
  document.querySelectorAll('.btn-timeline-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  });

  document.querySelectorAll('.btn-timeline-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  });

  // Add click handlers for job cards
  document.querySelectorAll('.btn-job-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Job details would open here');
    });
  });

  document.querySelectorAll('.btn-job-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.job-card');
      card.style.opacity = '0.5';
      setTimeout(() => card.remove(), 300);
    });
  });
});
