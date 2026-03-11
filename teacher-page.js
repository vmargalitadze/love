import { teachers } from './teachers-data.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTeacherIdFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  } catch (e) {
    return null;
  }
}

function renderTeacherDetail(t) {
  const nameEl = document.getElementById('teacher-name');
  const coursesEl = document.getElementById('teacher-courses');
  const roleEl = document.getElementById('teacher-role');
  const bioEl = document.getElementById('teacher-bio');
  const imgEl = document.getElementById('teacher-photo');

  if (nameEl) nameEl.textContent = t.name;
  if (coursesEl) coursesEl.textContent = t.courses || '';
  if (roleEl) roleEl.textContent = t.role || '';
  if (bioEl) bioEl.textContent = t.bio || '';
  if (imgEl) {
    imgEl.src = t.photo;
    imgEl.alt = t.name;
  }

  const eduMount = document.getElementById('teacher-education');
  if (eduMount) {
    const items = Array.isArray(t.education) ? t.education : [];
    eduMount.innerHTML = items
      .map(
        (it) => `
      <div class="education-item">
        <img class="education-item-icon" src="img/teacher.png" alt="" aria-hidden="true">
        <div class="education-item-body">
          <div class="education-title">${escapeHtml(it.title || '')}</div>
          ${it.text ? `<div class="education-text">${escapeHtml(it.text)}</div>` : ''}
        </div>
      </div>
    `
      )
      .join('');
  }
}

function teacherCard(t) {
  const href = `teacher.html?id=${encodeURIComponent(t.id)}`;
  return `
    <article class="teachers-item" data-teacher-id="${escapeHtml(t.id)}">
      <img src="${escapeHtml(t.photo)}" alt="${escapeHtml(t.name)}" class="teachers-item-img">
      <h3 class="teachers-item-name">${escapeHtml(t.name)}</h3>
      <p class="teachers-item-courses">${escapeHtml(t.courses)}</p>
      <a href="${escapeHtml(href)}" class="teachers-item-link">О преподавателе</a>
    </article>
  `;
}

function renderOtherTeachers(currentId) {
  const mount = document.getElementById('other-teachers-items');
  if (!mount) return;

  const list = teachers.filter((t) => t.id !== currentId);
  mount.innerHTML = list.map(teacherCard).join('');
  document.dispatchEvent(new CustomEvent('teachers:rendered'));
}

function initTeacherPage() {
  const id = getTeacherIdFromUrl();
  const teacher = teachers.find((t) => t.id === id) || teachers[0];
  if (!teacher) return;

  renderTeacherDetail(teacher);
  renderOtherTeachers(teacher.id);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeacherPage);
} else {
  initTeacherPage();
}

