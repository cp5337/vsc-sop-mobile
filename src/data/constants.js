// VSC SOP Data Constants
/**
 * VSC SOP Constants and Configuration
 * Written by: Charlie Payne @cp5337
 * Date: 2025-01-27
 * 
 * Centralized data configuration for posts, contacts, and emergency codes
 * 30% LOC will be implemented for further development
 */

export const posts = [
  { id: 'credentialer-entry', title: 'Credentialer - Entry Lane', booth: '324', shift: '24/7' },
  { id: 'credentialer-exit', title: 'Credentialer - Exit Lane', booth: '314', shift: '24/7' },
  { id: 'screening-inspector', title: 'Screening Inspector', booth: '325', shift: '24/7' },
  { id: 'lane-controller', title: 'Screening Lane Controller', booth: '282', shift: '24/7' },
  { id: 'equipment-operator', title: 'Equipment Operator', booth: 'M227/M229', shift: '24/7' },
  { id: 'image-interpreter', title: 'Image Interpreter', booth: 'M106', shift: '24/7' },
  { id: 'facility-coordinator', title: 'Facility Coordinator', booth: 'VSOC', shift: '0800-1600' },
  { id: 'radiation-officer', title: 'Radiation Safety Officer', booth: 'VSOC', shift: '0800-1600' },
  { id: 'vsc-manager', title: 'VSC Screening Manager', booth: 'M106', shift: '24/7' }
];

export const emergencyContacts = [
  { name: 'SACC', number: '(212) 435-5903', purpose: 'All incidents', priority: 'primary' },
  { name: 'Project Manager', number: '(718) 872-8717', purpose: 'Major incidents', priority: 'primary' },
  { name: 'Hub OCC', number: '(212) 435-4700', purpose: 'Equipment only', priority: 'secondary' },
  { name: 'VS3 Desk', number: '(212) 435-5909', purpose: 'Vehicle screening', priority: 'secondary' }
];

export const emergencyCodes = [
  { 
    code: '10-2', 
    description: 'Security Emergency - Lockdown', 
    action: 'IMMEDIATELY raise all barriers, secure position inside booth with doors locked, maintain visual observation, monitor radio but DO NOT transmit unless emergency', 
    severity: 'critical',
    response: [
      'Raise all barriers (Entry Lane 1)',
      'Echo: "10-2 acknowledged, Entry Lane secured"',
      'Secure position inside booth with doors locked',
      'Maintain visual observation through windows',
      'Monitor radio but DO NOT transmit unless emergency',
      'Log: time, vehicles in queue, observations',
      'Grant access to emergency vehicles/WTCS/PAPD only',
      'Await "All Clear" from VSC Manager or PAPD'
    ]
  },
  { 
    code: '10-3', 
    description: 'Security Emergency - Threat', 
    action: 'Secure position, await instructions', 
    severity: 'critical',
    response: [
      'Secure position immediately',
      'Follow same procedures as 10-2',
      'Await specific instructions from command',
      'Do not engage threat unless life is in immediate danger'
    ]
  },
  { 
    code: 'Code Yellow', 
    description: 'Access Control System Failure', 
    action: 'Redeploy to designated location', 
    severity: 'warning',
    response: [
      'Radio announcement: "Code Yellow - Access Control Failure"',
      'All posts respond: "Code Yellow acknowledged"',
      'Redeploy to designated location',
      'AUS Response team notified',
      'Maintain security protocols during system failure'
    ]
  }
];

export const getPostDetails = (postId) => {
  const details = {
    'credentialer-entry': {
      responsibilities: [
        'Control entry and exit lanes of VSC',
        'Verify all credentials and access cards',
        'Monitor radiation detection equipment (RPM)',
        'Manage traffic flow and maintain access control',
        'Provide professional customer service',
        'Conduct face-to-face relief procedures'
      ],
      equipment: [
        'Post orders (current version)',
        'Handheld radio with spare battery',
        'Post logbook with pen',
        'Wall-mounted access card reader',
        'RFID iPad (charged)',
        'Measuring stick (12\'9" marked)',
        'Emergency contact list',
        'Safety cones properly positioned'
      ],
      uniform: [
        'Black shirt/fleece with WTCS logos',
        'Tan tactical pants with cargo pockets',
        'Black/brown steel-toed boots (polished)',
        'Company-issued ballcap/beanie with MSA logo',
        'NYS Security Guard License in wallet',
        'PANYNJ access card on lanyard',
        'Radiation dosimeter on outer garment',
        'High-visibility safety vest (inclement weather)'
      ]
    },
    'credentialer-exit': {
      responsibilities: [
        'Control vehicle and pedestrian egress',
        'Collect screening materials',
        'Maintain exit lane security',
        'Prevent unauthorized departure'
      ],
      equipment: [
        'Post orders (current version)',
        'Handheld radio with spare battery',
        'Post logbook with pen',
        'RFID containers',
        'Exit tags',
        'Intercom phone (Ext 0104)'
      ]
    },
    'screening-inspector': {
      responsibilities: [
        'Verify POV credentials',
        'Physically screen vehicles',
        'Work with K9 teams',
        'Use security inspection cameras'
      ],
      equipment: [
        'Post orders',
        'Handheld radio',
        'Zistos UVSS camera',
        'Itemizer DX',
        'Screening placards',
        'PA laptop for logging'
      ]
    },
    'lane-controller': {
      responsibilities: [
        'Organize traffic flow',
        'Ensure proper lane usage',
        'Escort drivers and passengers',
        'Verify gantry clearance'
      ],
      equipment: [
        'Post orders',
        'Handheld radio',
        'Screening placards',
        'Color stickers',
        'Visitor passes',
        'Rapiscan workstation'
      ]
    },
    'equipment-operator': {
      responsibilities: [
        'Operate Gantry X-Ray machines',
        'Ensure gantry clearance',
        'Monitor equipment operation',
        'Emergency stop procedures'
      ],
      equipment: [
        'Post orders',
        'Handheld radio',
        'Rapiscan workstation',
        'Emergency stop button',
        'Intercom system',
        'Gantry controls'
      ]
    },
    'image-interpreter': {
      responsibilities: [
        'View x-ray images',
        'Identify hazards',
        'Determine clearance needs',
        'Coordinate secondary inspections'
      ],
      equipment: [
        'Post orders',
        'Handheld radio',
        'Rapiscan workstation',
        'UVSS monitors',
        'RPM alarm panel',
        'FLIR device'
      ]
    },
    'facility-coordinator': {
      responsibilities: [
        'Technical liaison',
        'Facility maintenance coordination',
        'Equipment malfunction reporting',
        'Contractor escort'
      ],
      equipment: [
        'Post orders',
        'Set of facility keys',
        'Handheld radio',
        'Work order log',
        'Contact directory',
        'SWPM forms'
      ]
    },
    'radiation-officer': {
      responsibilities: [
        'OSHA compliance',
        'Radiation safety program',
        'Dosimetry management',
        'Training coordination'
      ],
      equipment: [
        'Post orders',
        'Handheld radio',
        'Radiation detector',
        'Dosimeter storage box',
        'Exposure records',
        'Regulatory documents'
      ]
    },
    'vsc-manager': {
      responsibilities: [
        'Oversee entire operation',
        'Ensure full staffing',
        'Verify compliance',
        'Emergency coordination'
      ],
      equipment: [
        'Handheld radio',
        'Set of facility keys',
        'PA desktop computer',
        'Tour Manager cell phone',
        'Post orders binder',
        'S/MOD schedule'
      ]
    }
  };

  return details[postId] || { responsibilities: [], equipment: [] };
};
