(() => {
  const PHASES = ['symptoms', 'findings', 'plan', 'review'];
  const STORAGE_KEY = 'clinical-assessment-prototype-v2';
  const LEGACY_KEY = 'clinical-assessment-prototype-v1';
  const phaseLabels = {symptoms:'Symptoms', findings:'Findings', plan:'Plan', review:'Review'};
  const nameOptions = ['Chest tightness','Chest discomfort','Shortness of breath','Palpitations','Dizziness','Fatigue','Other'];

  const params = new URLSearchParams(location.search);
  const embedded = params.get('embed') === '1';
  if (embedded) {
    document.documentElement.classList.add('embed');
    document.body.classList.add('embed');
  }

  const panels = [...document.querySelectorAll('[data-panel]')];
  const phaseLinks = [...document.querySelectorAll('[data-phase-link]')];
  const notice = document.getElementById('notice');
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');
  const successPanel = document.getElementById('successPanel');
  const symptomStepper = document.getElementById('symptomStepper');
  const symptomProgress = document.getElementById('symptomProgress');
  const symptomSummary = document.getElementById('symptomSummary');
  const activeSymptomTitle = document.getElementById('activeSymptomTitle');
  const activeSymptomMeta = document.getElementById('activeSymptomMeta');
  const removeSymptomButton = document.getElementById('removeSymptom');
  const addSymptomButton = document.getElementById('addSymptom');

  const legacyStep = params.get('step');
  let current = PHASES.includes(params.get('phase'))
    ? params.get('phase')
    : (PHASES.includes(legacyStep) ? legacyStep : 'symptoms');
  let finished = false;
  const completedPhases = new Set();
  let saveTimer;
  let suppressFormEvents = false;

  const emptySymptom = () => ({
    id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    onsetKnown: 'known',
    onsetDate: '',
    frequencyKnown: 'known',
    frequency: '',
    duration: '',
    durationUnknown: false,
    context: '',
    description: '',
    symptomNotes: ''
  });

  const seed = () => ({
    symptoms: [
      {
        id: 's-chest',
        name: 'Chest tightness',
        onsetKnown: 'known',
        onsetDate: '2021-06-05',
        frequencyKnown: 'known',
        frequency: 'Intermittent',
        duration: '10',
        durationUnknown: false,
        context: 'With activity',
        description: 'Brief pressure in the centre of the chest while walking uphill; settles after resting.',
        symptomNotes: ''
      },
      {
        id: 's-sob',
        name: 'Shortness of breath',
        onsetKnown: 'known',
        onsetDate: '',
        frequencyKnown: 'known',
        frequency: '',
        duration: '',
        durationUnknown: false,
        context: '',
        description: '',
        symptomNotes: ''
      }
    ],
    activeSymptomId: 's-chest',
    systolic: '128',
    diastolic: '76',
    bpUnknown: false,
    heartRate: '78',
    heartRateUnknown: false,
    examNote: 'Regular rhythm noted in this fictional sample.',
    findings: ['ECG reviewed'],
    planNotes: 'Discussed the patient’s reported episodes and documented the sample findings for follow-up review.',
    followUp: 'Review at next scheduled appointment'
  });

  let state = seed();

  const $ = id => document.getElementById(id);
  const checked = name => document.querySelector(`input[name="${name}"]:checked`)?.value;
  const activeSymptom = () => state.symptoms.find(s => s.id === state.activeSymptomId) || state.symptoms[0];
  const symptomIndex = () => Math.max(0, state.symptoms.findIndex(s => s.id === state.activeSymptomId));

  function isSymptomComplete(symptom) {
    if (!symptom?.name) return false;
    if (symptom.onsetKnown === 'known' && !symptom.onsetDate) return false;
    if (symptom.frequencyKnown === 'known' && !String(symptom.frequency || '').trim()) return false;
    if (!symptom.durationUnknown && (!symptom.duration || !Number.isFinite(Number(symptom.duration)) || Number(symptom.duration) < 0)) return false;
    if (!String(symptom.description || '').trim()) return false;
    return true;
  }

  function migrateLegacy(data) {
    if (!data || typeof data !== 'object') return null;
    if (Array.isArray(data.symptoms)) return data;
    const first = emptySymptom();
    first.id = 's-legacy';
    first.name = data.symptom || '';
    first.onsetKnown = data.onsetKnown || 'known';
    first.onsetDate = data.onsetDate || '';
    first.frequencyKnown = data.frequencyKnown || 'known';
    first.frequency = data.frequency || '';
    first.duration = data.duration || '';
    first.durationUnknown = Boolean(data.durationUnknown);
    first.context = data.context || '';
    first.description = data.description || '';
    first.symptomNotes = data.symptomNotes || '';
    return {
      ...seed(),
      symptoms: [first],
      activeSymptomId: first.id,
      systolic: data.systolic ?? seed().systolic,
      diastolic: data.diastolic ?? seed().diastolic,
      bpUnknown: Boolean(data.bpUnknown),
      heartRate: data.heartRate ?? seed().heartRate,
      heartRateUnknown: Boolean(data.heartRateUnknown),
      examNote: data.examNote ?? seed().examNote,
      findings: Array.isArray(data.findings) ? data.findings : seed().findings,
      planNotes: data.planNotes ?? seed().planNotes,
      followUp: data.followUp ?? seed().followUp
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!raw) return;
      const migrated = migrateLegacy(JSON.parse(raw));
      if (!migrated) return;
      state = migrated;
      if (!state.symptoms.length) state.symptoms = [emptySymptom()];
      if (!state.symptoms.some(s => s.id === state.activeSymptomId)) state.activeSymptomId = state.symptoms[0].id;
    } catch { /* Local storage can be unavailable in private contexts. */ }
  }

  function persist() {
    syncFormIntoActive();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* Local storage can be unavailable in private contexts. */ }
  }

  function queueSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => persist(), 180);
    if (current === 'review') renderReview();
  }

  function syncFormIntoActive() {
    const symptom = activeSymptom();
    if (!symptom || current !== 'symptoms') {
      state.systolic = $('systolic').value;
      state.diastolic = $('diastolic').value;
      state.bpUnknown = $('bpUnknown').checked;
      state.heartRate = $('heartRate').value;
      state.heartRateUnknown = $('heartRateUnknown').checked;
      state.examNote = $('examNote').value;
      state.findings = [...document.querySelectorAll('input[name="finding"]:checked')].map(x => x.value);
      state.planNotes = $('planNotes').value;
      state.followUp = $('followUp').value;
      return;
    }
    symptom.name = $('symptomName').value;
    symptom.onsetKnown = checked('onsetKnown') || 'known';
    symptom.onsetDate = $('onsetDate').value;
    symptom.frequencyKnown = checked('frequencyKnown') || 'known';
    symptom.frequency = $('frequency').value;
    symptom.duration = $('duration').value;
    symptom.durationUnknown = $('durationUnknown').checked;
    symptom.context = $('context').value;
    symptom.description = $('description').value;
    symptom.symptomNotes = $('symptomNotes').value;
  }

  function fillFormFromActive() {
    const symptom = activeSymptom();
    if (!symptom) return;
    suppressFormEvents = true;
    $('symptomName').value = nameOptions.includes(symptom.name) ? symptom.name : (symptom.name ? 'Other' : '');
    if (symptom.name && !nameOptions.includes(symptom.name)) $('symptomName').value = 'Other';
    const onset = document.querySelector(`input[name="onsetKnown"][value="${symptom.onsetKnown === 'unknown' ? 'unknown' : 'known'}"]`);
    if (onset) onset.checked = true;
    $('onsetDate').value = symptom.onsetDate || '';
    const freq = document.querySelector(`input[name="frequencyKnown"][value="${symptom.frequencyKnown === 'unknown' ? 'unknown' : 'known'}"]`);
    if (freq) freq.checked = true;
    $('frequency').value = symptom.frequency || '';
    $('duration').value = symptom.duration || '';
    $('durationUnknown').checked = Boolean(symptom.durationUnknown);
    $('context').value = symptom.context || '';
    $('description').value = symptom.description || '';
    $('symptomNotes').value = symptom.symptomNotes || '';
    suppressFormEvents = false;
    updateKnownFields();
  }

  function fillNonSymptomFields() {
    suppressFormEvents = true;
    $('systolic').value = state.systolic || '';
    $('diastolic').value = state.diastolic || '';
    $('bpUnknown').checked = Boolean(state.bpUnknown);
    $('heartRate').value = state.heartRate || '';
    $('heartRateUnknown').checked = Boolean(state.heartRateUnknown);
    $('examNote').value = state.examNote || '';
    document.querySelectorAll('input[name="finding"]').forEach(input => {
      input.checked = Array.isArray(state.findings) && state.findings.includes(input.value);
    });
    $('planNotes').value = state.planNotes || '';
    $('followUp').value = state.followUp || '';
    suppressFormEvents = false;
    updateKnownFields();
  }

  function updateKnownFields() {
    const onsetUnknown = checked('onsetKnown') === 'unknown';
    $('onsetDate').disabled = onsetUnknown;
    const frequencyUnknown = checked('frequencyKnown') === 'unknown';
    $('frequency').disabled = frequencyUnknown;
    $('duration').disabled = $('durationUnknown').checked;
    $('systolic').disabled = $('bpUnknown').checked;
    $('diastolic').disabled = $('bpUnknown').checked;
    $('heartRate').disabled = $('heartRateUnknown').checked;
  }

  function renderSymptomStepper() {
    syncFormIntoActive();
    const total = state.symptoms.length;
    const index = symptomIndex();
    const completeCount = state.symptoms.filter(isSymptomComplete).length;
    symptomProgress.textContent = `SYMPTOM ${index + 1} OF ${total}`;
    activeSymptomTitle.textContent = activeSymptom()?.name || 'New symptom';
    activeSymptomMeta.textContent = `Symptom ${index + 1} of ${total}`;
    symptomSummary.textContent = `${completeCount} of ${total} complete`;
    removeSymptomButton.disabled = total <= 1;
    removeSymptomButton.hidden = total <= 1;

    symptomStepper.replaceChildren();
    state.symptoms.forEach((symptom, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'symptom-step';
      const complete = isSymptomComplete(symptom);
      const active = symptom.id === state.activeSymptomId;
      if (active) {
        button.classList.add('current');
        button.setAttribute('aria-current', 'step');
      }
      if (complete) button.classList.add('complete');
      const number = document.createElement('span');
      number.className = 'step-number';
      number.textContent = String(i + 1);
      const label = document.createElement('span');
      label.className = 'symptom-step-label';
      label.textContent = symptom.name || `Symptom ${i + 1}`;
      const status = document.createElement('em');
      status.textContent = complete ? 'Complete' : 'Needs details';
      button.append(number, label, status);
      button.addEventListener('click', () => selectSymptom(symptom.id));
      symptomStepper.append(button);
    });
  }

  function selectSymptom(id) {
    if (id === state.activeSymptomId) return;
    syncFormIntoActive();
    state.activeSymptomId = id;
    fillFormFromActive();
    renderSymptomStepper();
    persist(false);
    hideNotice();
    activeSymptomTitle.setAttribute('tabindex', '-1');
    activeSymptomTitle.focus();
  }

  function addSymptom() {
    syncFormIntoActive();
    const symptom = emptySymptom();
    state.symptoms.push(symptom);
    state.activeSymptomId = symptom.id;
    fillFormFromActive();
    renderSymptomStepper();
    persist();
    hideNotice();
    $('symptomName').focus();
  }

  function removeSymptom() {
    if (state.symptoms.length <= 1) return;
    syncFormIntoActive();
    const index = symptomIndex();
    state.symptoms.splice(index, 1);
    state.activeSymptomId = state.symptoms[Math.min(index, state.symptoms.length - 1)].id;
    fillFormFromActive();
    renderSymptomStepper();
    persist();
    hideNotice();
  }

  function getSymptomError(symptom) {
    if (!symptom.name) return ['symptomName', 'Choose a symptom to continue.'];
    if (symptom.onsetKnown === 'known' && !symptom.onsetDate) return ['onsetDate', 'Enter the onset date or select Unknown.'];
    if (symptom.frequencyKnown === 'known' && !String(symptom.frequency || '').trim()) return ['frequency', 'Enter the frequency or select Unknown.'];
    if (!symptom.durationUnknown && (!symptom.duration || !Number.isFinite(Number(symptom.duration)) || Number(symptom.duration) < 0)) {
      return ['duration', 'Enter a duration of zero or more, or mark it unknown.'];
    }
    if (!String(symptom.description || '').trim()) return ['description', 'Add the patient description before continuing.'];
    return null;
  }

  function getError(phase) {
    if (phase === 'symptoms') {
      syncFormIntoActive();
      const currentError = getSymptomError(activeSymptom());
      if (currentError) return currentError;
      const incomplete = state.symptoms.find(s => !isSymptomComplete(s));
      if (incomplete) {
        return ['symptomName', `Finish details for “${incomplete.name || 'the incomplete symptom'}” before continuing to findings.`];
      }
    }
    if (phase === 'findings') {
      if (!$('bpUnknown').checked && (!$('systolic').value || !$('diastolic').value || Number($('systolic').value) < 0 || Number($('diastolic').value) < 0)) {
        return ['systolic', 'Enter both blood pressure values of zero or more, or mark them not recorded / unknown.'];
      }
      if (!$('heartRateUnknown').checked && (!$('heartRate').value || Number($('heartRate').value) < 0)) {
        return ['heartRate', 'Enter a heart rate of zero or more or mark it not recorded / unknown.'];
      }
    }
    if (phase === 'plan' && !$('planNotes').value.trim()) return ['planNotes', 'Add documentation to the plan field before continuing.'];
    return null;
  }

  function showNotice(message, target) {
    hideNotice();
    notice.textContent = message;
    notice.hidden = false;
    if (target) {
      const control = $(target);
      if (control) {
        control.setAttribute('aria-invalid', 'true');
        const described = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (!described.includes('notice')) described.push('notice');
        control.setAttribute('aria-describedby', described.join(' '));
        control.focus();
      }
    }
  }

  function hideNotice() {
    notice.hidden = true;
    notice.textContent = '';
    document.querySelectorAll('[aria-invalid="true"]').forEach(el => {
      el.removeAttribute('aria-invalid');
      const described = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(token => token && token !== 'notice');
      if (described.length) el.setAttribute('aria-describedby', described.join(' '));
      else el.removeAttribute('aria-describedby');
    });
  }

  function text(value, fallback = 'Not recorded') {
    return value && String(value).trim() ? String(value).trim() : fallback;
  }

  function valueRow(dl, label, value) {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dl.append(dt, dd);
  }

  function reviewCard(title, phase, rows, symptomId) {
    const section = document.createElement('section');
    section.className = 'review-card';
    const head = document.createElement('div');
    head.className = 'review-card-head';
    const h = document.createElement('h3');
    h.textContent = title;
    const edit = document.createElement('a');
    edit.className = 'edit-link';
    edit.href = symptomId ? `?phase=symptoms&symptom=${encodeURIComponent(symptomId)}` : `?phase=${phase}`;
    edit.textContent = 'Edit';
    edit.setAttribute('aria-label', `Edit ${title.toLowerCase()}`);
    if (symptomId) edit.dataset.symptomId = symptomId;
    head.append(h, edit);
    const dl = document.createElement('dl');
    rows.forEach(([label, value]) => valueRow(dl, label, value));
    section.append(head, dl);
    return section;
  }

  function renderReview() {
    syncFormIntoActive();
    const root = $('reviewContent');
    root.replaceChildren();
    state.symptoms.forEach((symptom, i) => {
      root.append(reviewCard(symptom.name || `Symptom ${i + 1}`, 'symptoms', [
        ['Symptom', text(symptom.name)],
        ['Onset', symptom.onsetKnown === 'unknown' ? 'Unknown' : text(symptom.onsetDate)],
        ['Frequency', symptom.frequencyKnown === 'unknown' ? 'Unknown' : text(symptom.frequency)],
        ['Episode duration', symptom.durationUnknown ? 'Unknown' : `${text(symptom.duration)} minutes`],
        ['Context', text(symptom.context)],
        ['Patient description', text(symptom.description)],
        ['Additional notes', text(symptom.symptomNotes)]
      ], symptom.id));
    });
    const bp = state.bpUnknown ? 'Not recorded / unknown' : `${text(state.systolic)} / ${text(state.diastolic)} mmHg`;
    const hr = state.heartRateUnknown ? 'Not recorded / unknown' : `${text(state.heartRate)} bpm`;
    root.append(reviewCard('Findings', 'findings', [
      ['Blood pressure', bp],
      ['Heart rate', hr],
      ['Examination note', text(state.examNote)],
      ['Additional findings', state.findings.length ? state.findings.join(', ') : 'None selected'],
      ['Supporting results', 'Illustrative sample values shown in the Findings step; not patient results']
    ]));
    root.append(reviewCard('Plan documentation', 'plan', [
      ['Plan note', text(state.planNotes)],
      ['Follow-up note', text(state.followUp)]
    ]));
  }

  function updateButtons() {
    const index = PHASES.indexOf(current);
    backButton.disabled = index === 0 && symptomIndex() === 0;
    nextButton.disabled = false;
    nextButton.replaceChildren();
    if (current === 'review') {
      const span = document.createElement('span');
      span.textContent = finished ? 'Demo completed' : 'Finish demo';
      nextButton.append(span);
      nextButton.disabled = finished;
      return;
    }
    if (current === 'symptoms') {
      const onLast = symptomIndex() >= state.symptoms.length - 1;
      if (onLast) {
        nextButton.append(document.createTextNode('Continue to Findings '));
      } else {
        nextButton.append(document.createTextNode('Next symptom '));
      }
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      nextButton.append(arrow);
      return;
    }
    nextButton.append(document.createTextNode(`Continue to ${phaseLabels[PHASES[index + 1]]} `));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    nextButton.append(arrow);
  }

  function showPhase(phase, {updateUrl = true, focusHeading = true, symptomId} = {}) {
    if (current === 'symptoms') syncFormIntoActive();
    else syncFormIntoActive();
    current = phase;
    finished = false;
    successPanel.hidden = true;
    hideNotice();
    if (symptomId && state.symptoms.some(s => s.id === symptomId)) {
      state.activeSymptomId = symptomId;
    }
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== phase; });
    phaseLinks.forEach(link => {
      const active = link.dataset.phaseLink === phase;
      link.classList.toggle('active', active);
      link.classList.toggle('complete', completedPhases.has(link.dataset.phaseLink));
      if (active) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    if (phase === 'symptoms') {
      fillFormFromActive();
      renderSymptomStepper();
    } else {
      fillNonSymptomFields();
    }
    if (phase === 'review') renderReview();
    updateButtons();
    updateKnownFields();
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.delete('step');
      url.searchParams.set('phase', phase);
      if (embedded) url.searchParams.set('embed', '1');
      if (phase === 'symptoms') url.searchParams.set('symptom', state.activeSymptomId);
      else url.searchParams.delete('symptom');
      history.replaceState(null, '', url);
      if (embedded && window.parent !== window) {
        window.parent.postMessage({ type: 'clinical-assessment-phase', phase }, location.origin);
      }
    }
    if (focusHeading) {
      const heading = document.querySelector(`[data-panel="${phase}"] h2`);
      heading?.setAttribute('tabindex', '-1');
      heading?.focus();
    }
  }

  backButton.addEventListener('click', () => {
    if (current === 'symptoms' && symptomIndex() > 0) {
      selectSymptom(state.symptoms[symptomIndex() - 1].id);
      updateButtons();
      return;
    }
    const i = PHASES.indexOf(current);
    if (i > 0) showPhase(PHASES[i - 1]);
  });

  nextButton.addEventListener('click', () => {
    if (current === 'symptoms') {
      syncFormIntoActive();
      const error = getSymptomError(activeSymptom());
      if (error) {
        showNotice(error[1], error[0]);
        renderSymptomStepper();
        return;
      }
      persist(false);
      renderSymptomStepper();
      if (symptomIndex() < state.symptoms.length - 1) {
        selectSymptom(state.symptoms[symptomIndex() + 1].id);
        updateButtons();
        return;
      }
      const incomplete = state.symptoms.find(s => !isSymptomComplete(s));
      if (incomplete) {
        selectSymptom(incomplete.id);
        showNotice(`Finish details for “${incomplete.name || 'the incomplete symptom'}” before continuing to findings.`, 'symptomName');
        updateButtons();
        return;
      }
      completedPhases.add('symptoms');
      showPhase('findings');
      return;
    }

    const error = getError(current);
    if (error) {
      showNotice(error[1], error[0]);
      return;
    }
    persist(false);
    if (current === 'review') {
      for (const phase of PHASES.slice(0, 3)) {
        if (phase === 'symptoms') {
          const incomplete = state.symptoms.find(s => !isSymptomComplete(s));
          if (incomplete) {
            showPhase('symptoms', {symptomId: incomplete.id});
            showNotice(`Finish details for “${incomplete.name || 'the incomplete symptom'}” before finishing.`, 'symptomName');
            return;
          }
          continue;
        }
        const missing = getError(phase);
        if (missing) {
          showPhase(phase);
          showNotice(missing[1], missing[0]);
          return;
        }
      }
      PHASES.slice(0, 3).forEach(phase => completedPhases.add(phase));
      finished = true;
      successPanel.hidden = false;
      nextButton.textContent = 'Demo completed';
      nextButton.disabled = true;
      successPanel.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      if (embedded && window.parent !== window) {
        window.parent.postMessage({ type: 'clinical-assessment-complete' }, location.origin);
      }
      return;
    }
    completedPhases.add(current);
    showPhase(PHASES[PHASES.indexOf(current) + 1]);
  });

  phaseLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    persist(false);
    showPhase(link.dataset.phaseLink);
  }));

  document.addEventListener('click', event => {
    const link = event.target.closest('.edit-link');
    if (!link) return;
    event.preventDefault();
    persist(false);
    const url = new URL(link.href, location.href);
    const phase = url.searchParams.get('phase');
    const symptomId = link.dataset.symptomId || url.searchParams.get('symptom');
    if (PHASES.includes(phase)) showPhase(phase, {symptomId});
  });

  addSymptomButton.addEventListener('click', addSymptom);
  removeSymptomButton.addEventListener('click', removeSymptom);

  document.querySelectorAll('input,select,textarea').forEach(control => {
    const onChange = () => {
      if (suppressFormEvents) return;
      hideNotice();
      if (current === 'symptoms') {
        syncFormIntoActive();
        renderSymptomStepper();
        completedPhases.delete('symptoms');
      } else {
        const containing = control.closest('[data-panel]');
        if (containing) completedPhases.delete(containing.dataset.panel);
      }
      updateKnownFields();
      updateButtons();
      queueSave();
    };
    control.addEventListener('input', onChange);
    control.addEventListener('change', onChange);
  });

  window.addEventListener('popstate', () => {
    const nextParams = new URLSearchParams(location.search);
    const phase = nextParams.get('phase') || nextParams.get('step');
    if (PHASES.includes(phase)) showPhase(phase, {updateUrl: false, symptomId: nextParams.get('symptom')});
  });

  loadState();
  const startSymptom = params.get('symptom');
  if (startSymptom && state.symptoms.some(s => s.id === startSymptom)) state.activeSymptomId = startSymptom;
  fillNonSymptomFields();
  fillFormFromActive();
  renderSymptomStepper();
  persist(false);
  showPhase(current, {updateUrl: false, focusHeading: false, symptomId: state.activeSymptomId});
})();
