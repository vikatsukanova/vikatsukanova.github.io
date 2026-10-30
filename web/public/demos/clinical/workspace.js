(() => {
  const toast = document.getElementById('notice');
  const modal = document.getElementById('assessmentModal');
  const frame = document.getElementById('assessmentFrame');
  const modalTitle = document.getElementById('assessmentModalTitle');
  let toastTimer;
  let lastFocus = null;

  const announce = message => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  };

  const phases = new Set(['symptoms', 'findings', 'plan', 'review']);
  const MODAL_TITLE = 'New Assessment';

  const syncAssessmentUrl = phase => {
    const url = new URL(location.href);
    if (phase) url.searchParams.set('assessment', phase);
    else url.searchParams.delete('assessment');
    url.searchParams.delete('symptom');
    history.replaceState(null, '', url);
  };

  const openAssessment = (phase = 'symptoms') => {
    const nextPhase = phases.has(phase) ? phase : 'symptoms';
    lastFocus = document.activeElement;
    modalTitle.textContent = MODAL_TITLE;
    frame.src = `assessment.html?embed=1&phase=${encodeURIComponent(nextPhase)}`;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('assessment-open');
    syncAssessmentUrl(nextPhase);
    document.getElementById('closeAssessment').focus();
  };

  const closeAssessment = () => {
    if (modal.open) modal.close();
    else modal.removeAttribute('open');
    document.body.classList.remove('assessment-open');
    frame.src = 'about:blank';
    syncAssessmentUrl(null);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  document.querySelectorAll('[data-notice]').forEach(button => {
    button.addEventListener('click', () => announce(button.dataset.notice));
  });

  document.querySelectorAll('[data-open-assessment]').forEach(control => {
    control.addEventListener('click', () => openAssessment(control.dataset.openAssessment));
  });

  document.getElementById('addFindings').addEventListener('click', () => openAssessment('findings'));
  document.getElementById('closeAssessment').addEventListener('click', closeAssessment);
  modal.addEventListener('cancel', event => {
    event.preventDefault();
    closeAssessment();
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) closeAssessment();
  });

  window.addEventListener('message', event => {
    if (event.origin !== location.origin) return;
    const data = event.data || {};
    if (data.type === 'clinical-assessment-phase' && phases.has(data.phase)) {
      modalTitle.textContent = MODAL_TITLE;
      syncAssessmentUrl(data.phase);
    }
    if (data.type === 'clinical-assessment-complete') {
      announce('Demo assessment complete. No clinical record was created.');
    }
  });

  const bootPhase = new URLSearchParams(location.search).get('assessment');
  if (bootPhase) openAssessment(bootPhase);

  const diagnosisLabels = { CAD: 'Coronary artery disease', CMP: 'Cardiomyopathy', EP: 'Electrophysiology' };
  const diagnosisLabel = document.getElementById('diagnosis-label');
  const timeline = document.querySelector('.timeline');
  document.querySelectorAll('.diagnosis button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.diagnosis button').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      const key = button.textContent.trim();
      if (diagnosisLabel) diagnosisLabel.textContent = diagnosisLabels[key] || key;
      let empty = document.querySelector('.diagnosis-empty');
      if (key === 'CAD') {
        if (timeline) timeline.hidden = false;
        if (empty) empty.remove();
      } else {
        if (timeline) timeline.hidden = true;
        if (!empty && timeline) {
          empty = document.createElement('p');
          empty.className = 'diagnosis-empty';
          empty.textContent = 'No sample assessments for this diagnosis.';
          timeline.after(empty);
        }
      }
    });
  });

  document.querySelectorAll('[data-toggle-assessment]').forEach(control => {
    control.addEventListener('click', () => {
      const item = control.closest('.previous-assessment');
      if (!item) return;
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      control.setAttribute('aria-expanded', String(open));
    });
  });

  const resultData = {
    Labs: [['LDL','1.4 mmol/L'],['HbA1c','6.0 %'],['ALT','43 U/L'],['Potassium','4.0 mmol/L']],
    ECG: [['ECG','Report available'],['Date','8 June 2021'],['Status','On file']],
    Echo: [['Echocardiogram','Report available'],['Date','12 May 2021'],['Status','On file']],
    Cath: [['Cardiac catheterization','Report available'],['Date','15 March 2021'],['Status','On file']]
  };
  document.querySelectorAll('[data-results-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-results-tab]').forEach(item => {
        const selected = item === tab;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      const rows = resultData[tab.dataset.resultsTab];
      document.getElementById('resultsBody').replaceChildren(...rows.map(([label, value]) => {
        const row = document.createElement('tr');
        const key = document.createElement('td');
        const result = document.createElement('td');
        key.textContent = label;
        result.textContent = value;
        row.append(key, result);
        return row;
      }));
      const reportLink = document.querySelector('.results-foot .text-link');
      if (reportLink) {
        reportLink.setAttribute('aria-label', `View ${tab.dataset.resultsTab.toLowerCase()} reports`);
        reportLink.dataset.notice = `${tab.dataset.resultsTab} reports are not available in this preview.`;
      }
    });
  });

  document.querySelectorAll('[data-exam-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-exam-tab]').forEach(item => {
        const selected = item === tab;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      const category = tab.dataset.examTab.toLowerCase();
      const description = category === 'cardiac' ? "Add examination findings to document today's assessment." : `No ${category} findings recorded. Add findings to document today's assessment.`;
      document.querySelector('.empty-state p').textContent = description;
    });
  });

  const medData = {
    cardiac: [
      ['Antiplatelet', 'Antiplatelet medication details are not available in this preview.'],
      ['Calcium channel blocker', 'Calcium channel blocker details are not available in this preview.']
    ],
    other: [
      ['Proton pump inhibitor', 'Proton pump inhibitor details are not available in this preview.'],
      ['Statin adjunct', 'Statin adjunct details are not available in this preview.'],
      ['Analgesic', 'Analgesic details are not available in this preview.']
    ]
  };
  const medList = document.querySelector('[data-med-list]');
  const renderMeds = key => {
    const items = medData[key] || [];
    medList.replaceChildren(...items.map(([label, notice]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.notice = notice;
      button.innerHTML = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M5 4a4 4 0 0 1 5.7 0l3.3 3.3a4 4 0 0 1-5.7 5.7L5 9.7A4 4 0 0 1 5 4Z"/><path d="m5.5 10 5-5"/></svg><span></span><span class="chevron">›</span>';
      button.querySelector('span').textContent = label;
      button.addEventListener('click', () => announce(notice));
      return button;
    }));
  };
  document.querySelectorAll('[data-med-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-med-tab]').forEach(item => {
        const selected = item === tab;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      renderMeds(tab.dataset.medTab);
    });
  });
})();
