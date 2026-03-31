/**
 * Tooltip and educational text strings.
 * Keyed by filter/field name — used by filters.js, results.js, comparator.js.
 */
export const COPY = {
  frame_material: {
    label: 'Frame Material',
    tip: 'The main material of the bike frame. Affects weight, ride quality, and price.',
    options: {
      carbon:   'Lightest and stiffest. Best performance but pricier. Standard for racing bikes.',
      aluminum: 'Great value and durability. Slightly heavier than carbon. Ideal for everyday riding.',
      steel:    'Classic feel with natural vibration damping. Heavier, very durable, easy to repair.',
      titanium: 'Rare combination of lightness, durability, and comfort. Premium price.',
    },
  },
  brake_type: {
    label: 'Braking System',
    tip: 'How the bike stops. Disc brakes are now standard on most modern bikes.',
    options: {
      'hydraulic-disc':  'Best stopping power in all conditions. Self-adjusting pads. The current standard.',
      'mechanical-disc': 'Disc braking with cable actuation. More affordable, slightly less power.',
      'rim':             'Traditional braking directly on the wheel rim. Light but less effective in wet.',
    },
  },
  groupset_brand: {
    label: 'Groupset Brand',
    tip: 'Brand of the drivetrain components (shifters, derailleurs, brakes). All major brands offer excellent quality.',
  },
  groupset_level: {
    label: 'Groupset Level',
    tip: 'Range/tier within a brand. Higher levels mean lighter weight and smoother shifting, but higher cost.',
  },
  wheel_size: {
    label: 'Wheel Size',
    tip: 'Diameter of the wheels. 700c is road standard; 27.5" and 29" are MTB sizes.',
  },
  tire_clearance: {
    label: 'Max Tire Width',
    tip: 'The widest tyre the frame can fit. Wider tyres = more grip and comfort; narrower = faster on pavement.',
  },
  suspension: {
    label: 'Suspension Type',
    tip: 'How the bike absorbs trail impacts.',
    options: {
      hardtail:         'Front suspension fork only. Lighter and more efficient for pedalling. Great for XC and trail.',
      'full-suspension': 'Both front and rear suspension. More comfort and control on rough terrain. Heavier.',
    },
  },
  travel_mm: {
    label: 'Suspension Travel',
    tip: 'How much the suspension can compress. More travel = absorbs bigger hits (downhill). Less = more pedalling efficiency (XC).',
  },
  weight: {
    label: 'Weight',
    tip: 'Claimed weight, typically for a size M. Lower weight improves climbing and acceleration.',
  },
  sizes_available: {
    label: 'Available Sizes',
    tip: 'Frame sizes in stock for this model.',
  },
};
