    async function loadEquipmentList() {
      try {
        console.log('Завантажуємо список техніки...');
        const response = await fetch('data/equipment.json');
        console.log('Відповідь отримано:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Дані завантажені:', data);

        const tbody = document.getElementById('equipmentTableBody');

        if (!data.equipment || data.equipment.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5">Техніку не знайдено</td></tr>';
          return;
        }

        tbody.innerHTML = data.equipment.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.category}</td>
                <td>${item.manufacturer}</td>
            </tr>
        `).join('');

        console.log(`Завантажено ${data.equipment.length} техніки`);

      } catch (error) {
        console.error('Помилка завантаження:', error);
        const tbody = document.getElementById('equipmentTableBody');
        tbody.innerHTML = `<tr><td colspan="5" style="color: red;">Помилка: ${error.message}<br>Відкрийте файл через локальний сервер!</td></tr>`;
      }
    }

    document.getElementById('equipmentForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const equipment = {
        id: document.getElementById('equipmentId').value,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        manufacturer: document.getElementById('manufacturer').value,
        manufacturerFlag: document.getElementById('manufacturerFlag').value,
      };

      console.log('База:', equipment);


      if (!equipment.id || !equipment.name || !equipment.type || !equipment.category || !equipment.manufacturer || !equipment.manufacturerFlag) {
        alert('Потрібно заповнити id, назву, тип, категорію та виробника');
        return;
      }

      if (document.getElementById('image').value) {
        equipment.image = document.getElementById('image').value;
      }
      if (document.getElementById('image2').value) {
        equipment.image2 = document.getElementById('image2').value;
      }
      if (document.getElementById('image3').value) {
        equipment.image3 = document.getElementById('image3').value;
      }

      const specs = {};
      if (document.getElementById('weight').value) specs.weight = document.getElementById('weight').value;
      if (document.getElementById('crew').value) specs.crew = document.getElementById('crew').value;
      if (document.getElementById('engine').value) specs.engine = document.getElementById('engine').value;
      if (document.getElementById('power').value) specs.power = document.getElementById('power').value;
      if (document.getElementById('maxSpeed').value) specs.maxSpeed = document.getElementById('maxSpeed').value;
      if (document.getElementById('caliber').value) specs.caliber = document.getElementById('caliber').value;
      if (document.getElementById('rateOfFire').value) specs.rateOfFire = document.getElementById('rateOfFire').value;
      if (document.getElementById('range').value) specs.range = document.getElementById('range').value;
      if (document.getElementById('guidance').value) specs.guidance = document.getElementById('guidance').value;
      if (document.getElementById('armament').value) specs.armament = document.getElementById('armament').value;
      if (document.getElementById('numbermissiles').value) specs.numbermissiles = document.getElementById('numbermissiles').value;
      if (document.getElementById('radarRange').value) specs.radarRange = document.getElementById('radarRange').value;
      if (document.getElementById('frequencyRange').value) specs.frequencyRange = document.getElementById('frequencyRange').value;
      if (document.getElementById('maxHeight').value) specs.maxHeight = document.getElementById('maxHeight').value;
      if (document.getElementById('maxSpeedTarget').value) specs.maxSpeedTarget = document.getElementById('maxSpeedTarget').value;
      if (document.getElementById('typeTarget').value) specs.typeTarget = document.getElementById('typeTarget').value;
      if (document.getElementById('combatRadius').value) specs.combatRadius = document.getElementById('combatRadius').value;
      if (document.getElementById('radarType').value) specs.radarType = document.getElementById('radarType').value;
      if (document.getElementById('maxCombatLoad').value) specs.maxCombatLoad = document.getElementById('maxCombatLoad').value;

      if (Object.keys(specs).length > 0) {
        equipment.specs = specs;
      }

      if (document.getElementById('description').value) {
        equipment.description = document.getElementById('description').value;
      }

      const operatorsText = document.getElementById('operators').value.trim();
      if (operatorsText) {
        try {
          const operators = [];
          operatorsText.split('\n').forEach(line => {
            if (line.trim()) {
              operators.push(JSON.parse(line.trim()));
            }
          });
          if (operators.length > 0) {
            equipment.operators = operators;
          }
        } catch (err) {
          alert('Перевірте формат');
          return;
        }
      }

      const jsonOutput = document.getElementById('jsonOutput');
      const jsonString = JSON.stringify(equipment, null, 2) + ',';
      jsonOutput.textContent = jsonString;

      console.log('Готовий JSON', jsonString);

      document.getElementById('resultSection').classList.add('active');

      document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    });

    function copyToClipboard() {
      const text = document.getElementById('jsonOutput').textContent;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Скопійовано');
        }).catch((err) => {
          console.error('Помилка копіювання:', err);
          fallbackCopyTextToClipboard(text);
        });
      } else {
        fallbackCopyTextToClipboard(text);
      }
    }

    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Скопійовано');
        } else {
          alert('Помилка при копіюванні');
        }
      } catch (err) {
        console.error('Помилка копіювання:', err);
        alert('Помилка при копіюванні. Виділіть текст вручну і скопіюйте.');
      }

      document.body.removeChild(textArea);
    }