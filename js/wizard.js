/**
 * Guided selection wizard — 4 steps, state machine.
 * Renders into #wizard-root on index.html.
 */

const STEPS = [
  {
    id: 'use_case',
    question: 'How do you plan to ride?',
    subtitle: 'We\'ll find the right category for you.',
    choices: [
      { value: 'road',     icon: '🏎️', label: 'Pure Speed',       desc: 'Road & racing, fast on tarmac' },
      { value: 'road',     icon: '🛣️', label: 'Long Distance',    desc: 'Endurance & comfortable cruising' },
      { value: 'gravel',   icon: '🌄', label: 'Adventure & Gravel', desc: 'Mixed surfaces, bikepacking, exploration' },
      { value: 'mtb',      icon: '⛰️', label: 'Mountain & Off-road', desc: 'Trails, singletracks, technical terrain' },
    ],
    multi: false,
  },
  {
    id: 'level',
    question: 'How often do you ride?',
    subtitle: 'Helps us match the right equipment level.',
    choices: [
      { value: 'occasional', icon: '🌿', label: 'Occasional',  desc: 'A few times a month, leisure rides' },
      { value: 'regular',    icon: '🚴', label: 'Regular',     desc: 'Weekly rides, building fitness' },
      { value: 'competitor', icon: '🏆', label: 'Competitor',  desc: 'Racing or intensive training' },
    ],
    multi: false,
  },
  {
    id: 'budget_max',
    question: 'What\'s your maximum budget?',
    subtitle: 'Drag the slider to set your upper limit.',
    type: 'slider',
    min: 500,
    max: 15000,
    step: 250,
    default: 4000,
    format: v => `€${v.toLocaleString('fr-FR')}`,
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    subtitle: 'We\'ll highlight bikes that match your priorities.',
    choices: [
      { value: 'performance', icon: '⚡', label: 'Performance',  desc: 'Light, aerodynamic, fast' },
      { value: 'durability',  icon: '🛡️', label: 'Durability',   desc: 'Reliable, low-maintenance, tough' },
      { value: 'comfort',     icon: '☁️', label: 'Comfort',      desc: 'Smooth ride, upright position, long days' },
    ],
    multi: false,
  },
];

class Wizard {
  constructor(root) {
    this.root    = root;
    this.step    = 0;
    this.answers = {};
    this.render();
  }

  get currentStep() { return STEPS[this.step]; }

  select(value) {
    this.answers[this.currentStep.id] = value;
    if (this.step < STEPS.length - 1) {
      this.step++;
      this.render();
    } else {
      this.finish();
    }
  }

  back() {
    if (this.step > 0) { this.step--; this.render(); }
  }

  finish() {
    const p = new URLSearchParams();
    if (this.answers.use_case)   p.set('category',   this.answers.use_case);
    if (this.answers.budget_max) p.set('price_max',  this.answers.budget_max);
    if (this.answers.priority)   p.set('priority',   this.answers.priority);
    window.location.href = `results.html?${p.toString()}`;
  }

  render() {
    const s = this.currentStep;
    const progressPct = Math.round((this.step / STEPS.length) * 100);

    this.root.innerHTML = `
      <div class="wizard">
        <div class="wizard__progress">
          <div class="wizard__progress-bar" style="width:${progressPct}%"></div>
        </div>
        <div class="wizard__step">
          <p class="wizard__step-count">Step ${this.step + 1} of ${STEPS.length}</p>
          <h2 class="wizard__question">${s.question}</h2>
          <p class="wizard__subtitle">${s.subtitle}</p>

          ${s.type === 'slider' ? this.renderSlider(s) : this.renderChoices(s)}

          <div class="wizard__nav">
            ${this.step > 0 ? `<button class="btn btn-ghost" id="btn-back">← Back</button>` : '<div></div>'}
          </div>
        </div>
      </div>
    `;

    if (s.type === 'slider') {
      const slider  = this.root.querySelector('#slider');
      const display = this.root.querySelector('#slider-value');
      const btn     = this.root.querySelector('#btn-slider-next');
      let val = s.default;

      slider.addEventListener('input', () => {
        val = parseInt(slider.value);
        display.textContent = s.format(val);
      });
      btn.addEventListener('click', () => {
        this.answers[s.id] = val === s.max ? null : val;
        if (this.step < STEPS.length - 1) { this.step++; this.render(); }
        else this.finish();
      });
    }

    this.root.querySelectorAll('.wizard__choice').forEach(el => {
      el.addEventListener('click', () => this.select(el.dataset.value));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.select(el.dataset.value); }
      });
    });

    this.root.querySelector('#btn-back')?.addEventListener('click', () => this.back());
  }

  renderChoices(s) {
    return `<div class="wizard__choices">
      ${s.choices.map(c => `
        <button class="wizard__choice" data-value="${c.value}" tabindex="0" aria-label="${c.label}">
          <span class="wizard__choice-icon">${c.icon}</span>
          <span class="wizard__choice-label">${c.label}</span>
          <span class="wizard__choice-desc">${c.desc}</span>
        </button>
      `).join('')}
    </div>`;
  }

  renderSlider(s) {
    return `
      <div class="wizard__slider-wrap">
        <div class="wizard__slider-value" id="slider-value">${s.format(s.default)}</div>
        <input type="range" id="slider" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.default}" class="wizard__slider">
        <div class="wizard__slider-labels">
          <span>${s.format(s.min)}</span>
          <span>${s.format(s.max)}+</span>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-slider-next" style="margin-top:var(--sp-8)">
          Continue →
        </button>
      </div>
    `;
  }
}

export function initWizard(rootId) {
  const root = document.getElementById(rootId);
  if (root) new Wizard(root);
}
