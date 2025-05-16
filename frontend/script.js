// Helper: Apply theme CSS variables and update preview
function applyTheme(theme) {
  const root = document.body.style;
  root.setProperty('--primary-color', theme.primary || '#000000');
  root.setProperty('--accent-color', theme.accent || '#ff4081');
  root.setProperty('--secondary-bg', theme.secondary_bg || '#f0f0f0');
  root.setProperty('--font-family', theme.font || 'Georgia, serif');
  root.setProperty('--font-weight', theme.font_weight || 'normal');
  root.setProperty('--background', theme.background || '#ffffff');

  const preview = document.getElementById('themePreview');
  preview.style.borderColor = theme.primary || '#000';
  preview.innerText = `Theme applied:
  Font = ${theme.font},
  Background = ${theme.background},
  Accent = ${theme.accent},
  Secondary BG = ${theme.secondary_bg},
  Font Weight = ${theme.font_weight}`;

  // Save to localStorage
  localStorage.setItem('theme', JSON.stringify(theme));
}

// Fetch theme from backend by traits
async function fetchTheme(traits) {
  try {
    const res = await fetch('http://127.0.0.1:5000/generate-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(traits),
    });
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch (err) {
    alert('Failed to fetch theme from server.');
    console.error(err);
    return null;
  }
}

// Upload & Apply Theme from JSON file
async function uploadAndApplyTheme() {
  const fileInput = document.getElementById('traitFile');
  const file = fileInput.files[0];
  if (!file) return alert('Please upload a trait JSON file');

  const text = await file.text();
  let traits;
  try {
    traits = JSON.parse(text);
  } catch {
    return alert('Uploaded file contains invalid JSON');
  }

  const theme = await fetchTheme(traits);
  if (theme) applyTheme(theme);
}

// Generate Default Mock Theme
async function applyMockTheme() {
  const mockTraits = {
    eye_color: 'hazel',
    chronotype: 'midnight-owl',
  };
  const theme = await fetchTheme(mockTraits);
  if (theme) applyTheme(theme);
}

// Reset Theme to default mock & clear storage
function resetTheme() {
  localStorage.removeItem('theme');
  applyMockTheme();
}

// Submit Manual Traits from textarea
async function submitTraits() {
  const text = document.getElementById('traitEditor').value;
  let traits;
  try {
    traits = JSON.parse(text);
  } catch {
    alert('Invalid JSON format! Please correct it.');
    return;
  }

  const theme = await fetchTheme(traits);
  if (theme) applyTheme(theme);
}

// Apply Traits selected from dropdowns
async function applySelectedTraits() {
  const traits = {
    eye_color: document.getElementById('eyeColorSelect').value,
    chronotype: document.getElementById('chronotypeSelect').value,
    personality: document.getElementById('personalitySelect').value,
    // You can add hair_color, skin_tone etc. here if backend supports
  };

  // Remove empty keys
  Object.keys(traits).forEach(k => { if (!traits[k]) delete traits[k]; });

  const theme = await fetchTheme(traits);
  if (theme) applyTheme(theme);
}

// Download currently applied theme JSON
function downloadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    alert('No theme to download! Please apply a theme first.');
    return;
  }

  const blob = new Blob([savedTheme], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'theme.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// On page load: apply saved theme or mock theme, add event listeners
window.onload = () => {
  // Apply saved or mock theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    try {
      applyTheme(JSON.parse(savedTheme));
    } catch {
      applyMockTheme();
    }
  } else {
    applyMockTheme();
  }

  // Event listeners for buttons
  document.getElementById('uploadApplyBtn').onclick = uploadAndApplyTheme;
  document.getElementById('defaultThemeBtn').onclick = applyMockTheme;
  document.getElementById('resetThemeBtn').onclick = resetTheme;
  document.getElementById('submitTraitsBtn').onclick = submitTraits;
  document.getElementById('applySelectedTraitsBtn').onclick = applySelectedTraits;
  document.getElementById('downloadThemeBtn').onclick = downloadTheme;

  // Live JSON validation for manual traits textarea
  const traitEditor = document.getElementById('traitEditor');
  const jsonError = document.getElementById('jsonError');
  traitEditor.addEventListener('input', () => {
    const text = traitEditor.value.trim();
    if (!text) {
      jsonError.style.display = 'none';
      return;
    }
    try {
      JSON.parse(text);
      jsonError.style.display = 'none';
    } catch {
      jsonError.textContent = 'Invalid JSON format!';
      jsonError.style.display = 'block';
    }
  });
};
