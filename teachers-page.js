import { teachers } from './teachers-data.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function teacherCard(t) {
  const href = `teacher.html?id=${encodeURIComponent(t.id)}`;
  return `
    <article class="teachers-item teachers-item--grid" data-teacher-id="${escapeHtml(t.id)}">
      <img src="${escapeHtml(t.photo)}" alt="${escapeHtml(t.name)}" class="teachers-item-img">
      <h3 class="teachers-item-name">${escapeHtml(t.name)}</h3>
      <p class="teachers-item-courses">${escapeHtml(t.courses || '')}</p>
      <a href="${escapeHtml(href)}" class="teachers-item-link">О преподавателе</a>
    </article>
  `;
}

function renderAllTeachers() {
  const mount = document.getElementById('teachers-all-items');
  if (!mount) return;
  mount.innerHTML = teachers.map(teacherCard).join('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAllTeachers);
} else {
  renderAllTeachers();
}

