export const QUESTION_TYPES = {
  TEXT: 'text',
  COMMENT: 'comment',
  NUMBER: 'number',
  EMAIL: 'email',
  PASSWORD: 'password',
  PHONE: 'phone',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  DROPDOWN: 'dropdown',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BOOLEAN: 'boolean',
  RATING: 'rating',
  RANKING: 'ranking',
  MATRIX: 'matrix',
  MATRIX_DROPDOWN: 'matrixDropdown',
  MATRIX_DYNAMIC: 'matrixDynamic',
  IMAGE_PICKER: 'imagePicker',
  FILE_UPLOAD: 'fileUpload',
  SIGNATURE: 'signature',
  MULTIPLE_TEXT: 'multipleText',
  PANEL: 'panel',
  DYNAMIC_PANEL: 'dynamicPanel',
  HTML: 'html',
  EXPRESSION: 'expression',
  IMAGE: 'image',
  RICH_TEXT: 'richText',
  SLIDER: 'slider',
};

export const QUESTION_CATEGORIES = {
  BASIC: 'Basic',
  CHOICE: 'Choice',
  ADVANCED: 'Advanced',
  LAYOUT: 'Layout',
  MEDIA: 'Media',
};

export const getQuestionConfig = (type) => {
  const configs = {
    [QUESTION_TYPES.TEXT]: {
      label: 'Text',
      icon: 'Type',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { placeholder: 'Enter text...', maxLength: 255 },
    },
    [QUESTION_TYPES.COMMENT]: {
      label: 'Comment',
      icon: 'MessageSquare',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { placeholder: 'Enter your comments...', rows: 4 },
    },
    [QUESTION_TYPES.NUMBER]: {
      label: 'Number',
      icon: 'Hash',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { min: 0, max: 100, step: 1 },
    },
    [QUESTION_TYPES.EMAIL]: {
      label: 'Email',
      icon: 'Mail',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { placeholder: 'Enter email...', validation: 'email' },
    },
    [QUESTION_TYPES.PASSWORD]: {
      label: 'Password',
      icon: 'Lock',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { placeholder: 'Enter password...' },
    },
    [QUESTION_TYPES.PHONE]: {
      label: 'Phone',
      icon: 'Phone',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { placeholder: 'Enter phone number...', validation: 'phone' },
    },
    [QUESTION_TYPES.DATE]: {
      label: 'Date',
      icon: 'Calendar',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { dateFormat: 'MM/dd/yyyy' },
    },
    [QUESTION_TYPES.TIME]: {
      label: 'Time',
      icon: 'Clock',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { timeFormat: 'HH:mm' },
    },
    [QUESTION_TYPES.DATETIME]: {
      label: 'DateTime',
      icon: 'CalendarClock',
      category: QUESTION_CATEGORIES.BASIC,
      defaultSettings: { dateFormat: 'MM/dd/yyyy HH:mm' },
    },
    [QUESTION_TYPES.DROPDOWN]: {
      label: 'Dropdown',
      icon: 'ChevronDown',
      category: QUESTION_CATEGORIES.CHOICE,
      defaultSettings: { options: ['Option 1', 'Option 2', 'Option 3'] },
    },
    [QUESTION_TYPES.RADIO]: {
      label: 'Radio Group',
      icon: 'Circle',
      category: QUESTION_CATEGORIES.CHOICE,
      defaultSettings: { options: ['Option 1', 'Option 2', 'Option 3'] },
    },
    [QUESTION_TYPES.CHECKBOX]: {
      label: 'Checkbox',
      icon: 'CheckSquare',
      category: QUESTION_CATEGORIES.CHOICE,
      defaultSettings: { options: ['Option 1', 'Option 2', 'Option 3'] },
    },
    [QUESTION_TYPES.BOOLEAN]: {
      label: 'Boolean',
      icon: 'ToggleLeft',
      category: QUESTION_CATEGORIES.CHOICE,
      defaultSettings: { labelTrue: 'Yes', labelFalse: 'No' },
    },
    [QUESTION_TYPES.RATING]: {
      label: 'Rating',
      icon: 'Star',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { maxRating: 5, rateType: 'stars' },
    },
    [QUESTION_TYPES.RANKING]: {
      label: 'Ranking',
      icon: 'ArrowUpDown',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { items: ['Item 1', 'Item 2', 'Item 3'] },
    },
    [QUESTION_TYPES.MATRIX]: {
      label: 'Matrix',
      icon: 'Grid',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { rows: ['Row 1', 'Row 2'], columns: ['Column 1', 'Column 2'] },
    },
    [QUESTION_TYPES.MATRIX_DROPDOWN]: {
      label: 'Matrix Dropdown',
      icon: 'Table',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { rows: ['Row 1', 'Row 2'], columns: ['Column 1', 'Column 2'] },
    },
    [QUESTION_TYPES.MATRIX_DYNAMIC]: {
      label: 'Matrix Dynamic',
      icon: 'Layers',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { rowCount: 2, columnCount: 2 },
    },
    [QUESTION_TYPES.IMAGE_PICKER]: {
      label: 'Image Picker',
      icon: 'Image',
      category: QUESTION_CATEGORIES.MEDIA,
      defaultSettings: { multiSelect: false, imageWidth: 200, imageHeight: 200 },
    },
    [QUESTION_TYPES.FILE_UPLOAD]: {
      label: 'File Upload',
      icon: 'Upload',
      category: QUESTION_CATEGORIES.MEDIA,
      defaultSettings: { maxSize: 5, allowedTypes: ['image/*', 'application/pdf'] },
    },
    [QUESTION_TYPES.SIGNATURE]: {
      label: 'Signature',
      icon: 'PenTool',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { width: 400, height: 200 },
    },
    [QUESTION_TYPES.MULTIPLE_TEXT]: {
      label: 'Multiple Text',
      icon: 'AlignJustify',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { fields: ['Field 1', 'Field 2'] },
    },
    [QUESTION_TYPES.PANEL]: {
      label: 'Panel',
      icon: 'Layout',
      category: QUESTION_CATEGORIES.LAYOUT,
      defaultSettings: { showHeader: true },
    },
    [QUESTION_TYPES.DYNAMIC_PANEL]: {
      label: 'Dynamic Panel',
      icon: 'Layers',
      category: QUESTION_CATEGORIES.LAYOUT,
      defaultSettings: { minPanelCount: 1, maxPanelCount: 10 },
    },
    [QUESTION_TYPES.HTML]: {
      label: 'HTML',
      icon: 'Code',
      category: QUESTION_CATEGORIES.LAYOUT,
      defaultSettings: { html: '<p>Enter your HTML content here</p>' },
    },
    [QUESTION_TYPES.EXPRESSION]: {
      label: 'Expression',
      icon: 'Calculator',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { expression: '', calculated: false },
    },
    [QUESTION_TYPES.IMAGE]: {
      label: 'Image',
      icon: 'Image',
      category: QUESTION_CATEGORIES.MEDIA,
      defaultSettings: { url: '', alt: '' },
    },
    [QUESTION_TYPES.RICH_TEXT]: {
      label: 'Rich Text',
      icon: 'FileText',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { content: '' },
    },
    [QUESTION_TYPES.SLIDER]: {
      label: 'Slider',
      icon: 'Sliders',
      category: QUESTION_CATEGORIES.ADVANCED,
      defaultSettings: { min: 0, max: 100, step: 1, showValue: true },
    },
  };
  return configs[type] || configs[QUESTION_TYPES.TEXT];
};

export const getQuestionCategories = () => {
  return Object.values(QUESTION_CATEGORIES);
};

export const getQuestionsByCategory = (category) => {
  return Object.entries(QUESTION_TYPES)
    .filter(([key, value]) => {
      const config = getQuestionConfig(value);
      return config.category === category;
    })
    .map(([key, value]) => ({
      type: value,
      ...getQuestionConfig(value),
    }));
};

export const getAllQuestionTypes = () => {
  return Object.entries(QUESTION_TYPES).map(([key, value]) => ({
    type: value,
    ...getQuestionConfig(value),
  }));
};