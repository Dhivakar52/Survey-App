// Mock survey API for SSI (Surgical Site Infection) Survey
// Swap the internals of each function for real `fetch` calls to your backend

const SURVEY_ID = 2;
const SUBMISSION_KEY = `survey_submission_${SURVEY_ID}`;
const NETWORK_DELAY = 500;

const SURVEY_META = {
  surveyId: SURVEY_ID,
  title: {
    en: ' SRM Medical College Hospital & Research Centre !!',
    ta: 'எஸ்.ஆர்.எம். மருத்துவக் கல்லூரி மருத்துவமனை மற்றும் ஆராய்ச்சி மையம்!!',
    hi: 'एसआरएम मेडिकल कॉलेज अस्पताल और अनुसंधान केंद्र की ओर से बधाई !!',
  },
  description: {
    en: 'Please take a few moments to answer the following questions. Your feedback is valuable to us. ',
    ta: 'உங்கள் மதிப்புமிக்க நேரத்தை ஒதுக்கி, கீழ்க்காணும் கேள்விகளுக்குப் பதில் தருமாறு கேட்டுக்கொள்கிறோம். உங்கள் கருத்து எங்களுக்கு முக்கியமானது.',
    hi: 'कृपया कुछ क्षण निकालकर निम्नलिखित प्रश्नों के उत्तर दें। आपकी प्रतिक्रिया हमारे लिए मूल्यवान है। धन्यवाद।',
  },
};

// Patient demographics - these would be pre-filled from hospital records
const PATIENT_DEMOGRAPHICS = {
  patientName: { en: 'Patient Name', ta: 'நோயாளியின் பெயர்', hi: 'रोगी का नाम' },
  ageGender: { en: 'Age / Gender', ta: 'வயது / பாலினம்', hi: 'आयु / लिंग' },
  dischargeDate: { en: 'Date of Discharge', ta: 'டிஸ்சார்ஜ் தேதி', hi: 'डिस्चार्ज की तारीख' },
  surgeonName: { en: 'Surgeon Name', ta: 'அறுவை மருத்துவர் பெயர்', hi: 'सर्जन का नाम' },
};

// Actual patient data (localized)
const PATIENT_DATA = {
  name: {
    en: 'Rajesh Kumar',
    ta: 'ராஜேஷ் குமார்',
    hi: 'राजेश कुमार'
  },
  ageGender: {
    en: '45 / Male',
    ta: '45 / ஆண்',
    hi: '45 / पुरुष'
  },
  dischargeDate: {
    en: '2026-07-15',
    ta: '15-07-2026',
    hi: '15-07-2026'
  },
  surgeonName: {
    en: 'Dr. S. Venkatesh',
    ta: 'டாக்டர். எஸ். வெங்கடேஷ்',
    hi: 'डॉ. एस. वेंकटेश'
  }
};

// Add localized common text for yes/no options
const COMMON_TEXT = {
  yes: {
    en: 'Yes',
    ta: 'ஆம்',
    hi: 'हाँ',
  },
  no: {
    en: 'No',
    ta: 'இல்லை',
    hi: 'नहीं',
  },
};

// SSI Surveillance Questions
const QUESTIONS = [
  {
    id: 1,
    type: 'yesno',
    required: true,
    question: {
      en: 'Did you have fever after hospital discharge?',
      ta: 'மருத்துவமனையிலிருந்து டிஸ்சார்ஜ் ஆன பிறகு உங்களுக்கு காய்ச்சல் ஏற்பட்டதா?',
      hi: 'क्या अस्पताल से छुट्टी के बाद आपको बुखार हुआ?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 2,
    type: 'yesno',
    required: true,
    question: {
      en: 'Was there any yellowish secretion or pus in the surgical wound?',
      ta: 'அறுவை சிகிச்சை செய்யப்பட்ட இடத்திலிருந்து சீழ் அல்லது திரவம் வெளியேறியதா?',
      hi: 'क्या सर्जिकल घाव से पीला स्राव या मवाद निकला?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 3,
    type: 'yesno',
    required: true,
    question: {
      en: 'Was there any swelling or redness around the wound?',
      ta: 'அறுவை சிகிச்சை செய்யப்பட்ட இடத்தைச் சுற்றி சிவப்பு நிறம் அல்லது வீக்கம் ஏற்பட்டதா?',
      hi: 'क्या घाव के आसपास सूजन या लालिमा थी?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 4,
    type: 'yesno',
    required: true,
    question: {
      en: 'Do you have any fluid leaking from your wound?',
      ta: 'அறுவை சிகிச்சைக் காயத்திலிருந்து ஏதேனும் திரவம் வெளியேறியதா?',
      hi: 'क्या आपके घाव से कोई तरल पदार्थ रिस रहा है?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 5,
    type: 'radio',
    required: false,
    question: {
      en: 'If YES to fluid leakage, what was the nature of the fluid?',
      ta: 'திரவம் வெளியேறியிருந்தால், அது எந்த வகையான திரவமாக இருந்தது?',
      hi: 'यदि तरल पदार्थ रिस रहा था, तो तरल की प्रकृति क्या थी?',
    },
    options: {
      en: ['Clear', 'Pus / Cloudy yellow', 'Pink, red or blood'],
      ta: ['தெளிவானது', 'சீழ் / மஞ்சள் நிற மேகம்', 'இளஞ்சிவப்பு, சிவப்பு அல்லது இரத்தம்'],
      hi: ['स्पष्ट', 'मवाद / बादलदार पीला', 'गुलाबी, लाल या खून'],
    },
    dependsOn: { questionId: 4, value: 'yes' },
  },
  {
    id: 6,
    type: 'yesno',
    required: true,
    question: {
      en: 'Was there a delay in the healing of the surgical wound?',
      ta: 'அறுவை சிகிச்சைக் காயம் ஆறுவதில் தாமதம் ஏற்பட்டதா?',
      hi: 'क्या सर्जिकल घाव के ठीक होने में देरी हुई?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 7,
    type: 'yesno',
    required: true,
    question: {
      en: 'Is the wound gaping open?',
      ta: 'அறுவை சிகிச்சைக் காயம் திறந்துவிட்டதா (பிரிந்துவிட்டதா)?',
      hi: 'क्या घाव खुला है (अलग हो गया है)?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 8,
    type: 'yesno',
    required: true,
    question: {
      en: 'Did any doctor tell you that you had a surgical infection?',
      ta: 'அறுவை சிகிச்சைக் காயத்தில் தொற்று ஏற்பட்டுள்ளதாக மருத்துவர் உங்களிடம் கூறினாரா?',
      hi: 'क्या किसी डॉक्टर ने आपको बताया कि आपको सर्जिकल संक्रमण है?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 9,
    type: 'yesno',
    required: true,
    question: {
      en: 'Was any new antibiotic prescribed for treating your wound after discharge?',
      ta: 'டிஸ்சார்ஜ் ஆன பிறகு காயத் தொற்றுக்காக புதிய ஆன்டிபயாட்டிக் மருந்து பரிந்துரைக்கப்பட்டதா?',
      hi: 'क्या डिस्चार्ज के बाद आपके घाव के इलाज के लिए कोई नया एंटीबायोटिक निर्धारित किया गया था?',
    },
    options: COMMON_TEXT,
  },
  {
    id: 10,
    type: 'text',
    required: false,
    question: {
      en: 'If YES, please specify the antibiotic name(s)',
      ta: 'ஆம் எனில், மருந்தின் பெயரைக் குறிப்பிடவும்',
      hi: 'यदि हाँ, तो एंटीबायोटिक का नाम बताएं',
    },
    dependsOn: { questionId: 9, value: 'yes' },
  },
  {
    id: 11,
    type: 'number',
    required: false,
    question: {
      en: 'How many days ago did you first notice any signs of infection?',
      ta: 'தொற்றின் அறிகுறிகளை நீங்கள் முதன்முதலில் எத்தனை நாட்களுக்கு முன் கவனித்தீர்கள்?',
      hi: 'आपने संक्रमण के लक्षण पहली बार कितने दिन पहले देखे थे?',
    },
    placeholder: {
      en: 'Enter number of days',
      ta: 'நாட்களின் எண்ணிக்கையை உள்ளிடவும்',
      hi: 'दिनों की संख्या दर्ज करें',
    },
  },
];

function delay(ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function localize(field, lang) {
  return field?.[lang] || field?.en || '';
}

/** GET /surveys/:id — survey metadata + submitted flag */
export async function fetchSurvey(lang = 'en') {
  await delay();
  const existing = readSubmission();
  return {
    surveyId: SURVEY_META.surveyId,
    title: localize(SURVEY_META.title, lang),
    description: localize(SURVEY_META.description, lang),
    submitted: Boolean(existing),
    patientDemographics: {
      name: localize(PATIENT_DEMOGRAPHICS.patientName, lang),
      ageGender: localize(PATIENT_DEMOGRAPHICS.ageGender, lang),
      dischargeDate: localize(PATIENT_DEMOGRAPHICS.dischargeDate, lang),
      surgeonName: localize(PATIENT_DEMOGRAPHICS.surgeonName, lang),
    },
    patientData: {
      name: localize(PATIENT_DATA.name, lang),
      ageGender: localize(PATIENT_DATA.ageGender, lang),
      dischargeDate: localize(PATIENT_DATA.dischargeDate, lang),
      surgeonName: localize(PATIENT_DATA.surgeonName, lang),
    }
  };
}

/** GET /surveys/:id/questions?lang= */
export async function fetchQuestions(lang = 'en') {
  await delay();
  return QUESTIONS.map((q) => {
    const questionData = {
      id: q.id,
      type: q.type,
      required: q.required,
      question: localize(q.question, lang),
      dependsOn: q.dependsOn || undefined,
      placeholder: q.placeholder ? localize(q.placeholder, lang) : undefined,
    };

    // Handle options - special case for yesno type
    if (q.type === 'yesno' && q.options) {
      questionData.options = [
        localize(q.options.yes, lang),
        localize(q.options.no, lang)
      ];
    } else if (q.options) {
      questionData.options = localize(q.options, lang);
    }

    return questionData;
  });
}

/** GET /surveys/:id/submission — existing submission, if any */
export async function fetchSubmissionStatus() {
  await delay(300);
  const existing = readSubmission();
  return existing || { submitted: false };
}

/** POST /surveys/:id/submit */
export async function submitSurvey({ language, answers, demographics }) {
  await delay(700);
  
  // Validate required questions
  const requiredQuestions = QUESTIONS.filter(q => q.required);
  const missingRequired = requiredQuestions.filter(q => {
    const answer = answers[q.id];
    return answer === undefined || answer === null || answer === '';
  });
  
  if (missingRequired.length > 0) {
    throw new Error(`Missing required questions: ${missingRequired.map(q => q.id).join(', ')}`);
  }
  
  // Calculate SSI risk score based on answers
  const infectionIndicators = [1, 2, 3, 4, 6, 7, 8];
  let riskScore = 0;
  let infectionLikely = false;
  
  infectionIndicators.forEach(qId => {
    if (answers[qId] === 'yes') {
      riskScore++;
    }
  });
  
  if (riskScore >= 3) {
    infectionLikely = true;
  }
  
  const submissionId = `SSI-${Date.now().toString(36).toUpperCase()}`;
  const record = {
    submitted: true,
    surveyId: SURVEY_ID,
    language,
    demographics,
    answers,
    submissionId,
    submissionDate: new Date().toISOString(),
    riskScore,
    infectionLikely,
    hospital: 'SRM Medical College Hospital & Research Center',
  };
  
  window.localStorage.setItem(SUBMISSION_KEY, JSON.stringify(record));
  return record;
}

function readSubmission() {
  try {
    const raw = window.localStorage.getItem(SUBMISSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Dev helper, not part of the real contract: clears the mock "already submitted" state. */
export function __resetSubmission() {
  window.localStorage.removeItem(SUBMISSION_KEY);
}

// Export additional utilities for hospital use
export const SURVEY_CONSTANTS = {
  SURVEY_ID,
  SUBMISSION_KEY,
  QUESTIONS,
  SURVEY_META,
  PATIENT_DEMOGRAPHICS,
  PATIENT_DATA,
};