const formFieldIds = [
  'equipmentId', 'name', 'type', 'category', 'manufacturer', 'manufacturerFlag',
  'image', 'image2', 'image3', 'description', 'operators'
];

const specFieldIds = [
  'weight', 'crew', 'engine', 'power', 'maxSpeed', 'caliber', 'rateOfFire',
  'range', 'guidance', 'armament', 'numbermissiles', 'radarRange', 'frequencyRange',
  'maxHeight', 'maxSpeedTarget', 'typeTarget', 'combatRadius', 'radarType', 'maxCombatLoad'
];

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : '';
}

function renderTableBody(items) {
  const tbody = document.getElementById('equipmentTableBody');
  if (!tbody) return;

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Техніку не знайдено</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${item.category}</td>
      <td>${item.manufacturer}</td>
    </tr>
  `).join('');
}

async function loadEquipmentList() {
  try {
    const response = await fetch('data/equipment.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    renderTableBody(data.equipment);
  } catch (error) {
    console.error('Помилка завантаження:', error);
    renderTableBody([]);
    const tbody = document.getElementById('equipmentTableBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" style="color: red;">Помилка: ${error.message}<br>Відкрийте файл через локальний сервер!</td></tr>`;
    }
  }
}

function collectSpecs() {
  return specFieldIds.reduce((specs, id) => {
    const value = getValue(id);
    if (value) {
      specs[id] = value;
    }
    return specs;
  }, {});
}

function parseOperators(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function buildEquipmentObject() {
  const equipment = {
    id: getValue('equipmentId'),
    name: getValue('name'),
    type: getValue('type'),
    category: getValue('category'),
    manufacturer: getValue('manufacturer'),
    manufacturerFlag: getValue('manufacturerFlag')
  };

  ['image', 'image2', 'image3'].forEach(id => {
    const value = getValue(id);
    if (value) {
      equipment[id] = value;
    }
  });

  const specs = collectSpecs();
  if (Object.keys(specs).length > 0) {
    equipment.specs = specs;
  }

  const description = getValue('description');
  if (description) {
    equipment.description = description;
  }

  const operatorsText = getValue('operators');
  if (operatorsText) {
    equipment.operators = parseOperators(operatorsText);
  }

  return equipment;
}

function validateEquipment(equipment) {
  const required = ['id', 'name', 'type', 'category', 'manufacturer', 'manufacturerFlag'];
  return required.every(field => equipment[field]);
}

function showResult(jsonString) {
  const jsonOutput = document.getElementById('jsonOutput');
  const resultSection = document.getElementById('resultSection');
  if (!jsonOutput || !resultSection) return;

  jsonOutput.textContent = jsonString;
  resultSection.classList.add('active');
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const equipment = buildEquipmentObject();
  if (!validateEquipment(equipment)) {
    alert('Потрібно заповнити id, назву, тип, категорію та виробника');
    return;
  }

  try {
    const jsonString = JSON.stringify(equipment, null, 2) + ',';
    showResult(jsonString);
  } catch (error) {
    console.error('Помилка формування JSON:', error);
    alert('Сталася помилка при формуванні JSON. Перевірте дані.');
  }
}

function copyToClipboard() {
  const jsonOutput = document.getElementById('jsonOutput');
  const text = jsonOutput ? jsonOutput.textContent : '';
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Скопійовано');
    }).catch(err => {
      console.error('Помилка копіювання:', err);
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    alert(successful ? 'Скопійовано' : 'Помилка при копіюванні');
  } catch (err) {
    console.error('Помилка копіювання:', err);
    alert('Помилка при копіюванні. Виділіть текст вручну і скопіюйте.');
  }

  document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', () => {
  loadEquipmentList();

  const equipmentForm = document.getElementById('equipmentForm');
  if (equipmentForm) {
    equipmentForm.addEventListener('submit', handleFormSubmit);
  }

  const copyButton = document.getElementById('copyButton');
  if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard);
  }
});