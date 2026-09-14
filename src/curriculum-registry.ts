export type Grade = 'Grade R'|'Grade 1'|'Grade 2'|'Grade 3'|'Grade 4'|'Grade 5'|'Grade 6'|'Grade 7'|'Grade 8'|'Grade 9'|'Grade 10'|'Grade 11'|'Grade 12';
export type Phase = 'Foundation Phase'|'Intermediate Phase'|'Senior Phase'|'FET Phase';

export type SubjectDefinition = {
  name: string;
  category: 'Language'|'Core'|'Science'|'Humanities'|'Technology'|'Arts'|'Commerce'|'Agriculture'|'Technical'|'Vocational'|'Wellbeing';
  notes?: string;
  variants?: string[];
};

export type GradeCurriculum = {
  grade: Grade;
  phase: Phase;
  subjects: SubjectDefinition[];
};

export const grades: Grade[] = ['Grade R','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];

export const officialLanguageSubjects = [
  'Afrikaans','English','isiNdebele','isiXhosa','isiZulu','Sepedi','Sesotho','Setswana','siSwati','Tshivenda','XiTsonga','South African Sign Language'
];
export const secondAdditionalLanguages = [
  'Afrikaans','English','French','isiNdebele','isiXhosa','isiZulu','Mandarin','Sepedi','Sesotho','Setswana','siSwati','Tshivenda','XiTsonga'
];

const language=(name:string,variants=officialLanguageSubjects,notes?:string):SubjectDefinition=>({name,category:'Language',variants,notes});

const foundation: SubjectDefinition[] = [
  language('Home Language'),
  language('First Additional Language',officialLanguageSubjects.filter(x=>x!=='South African Sign Language')),
  {name:'Mathematics',category:'Core'},
  {name:'Life Skills',category:'Wellbeing'},
  {name:'Coding and Robotics',category:'Technology',notes:'Included where implemented by the school / current DBE rollout'},
  {name:'South African Sign Language',category:'Language',notes:'Visual/sign-language curriculum where applicable'}
];

const intermediate: SubjectDefinition[] = [
  language('Home Language'),
  language('First Additional Language',officialLanguageSubjects.filter(x=>x!=='South African Sign Language')),
  {name:'Mathematics',category:'Core'},
  {name:'Natural Sciences and Technology',category:'Science'},
  {name:'Social Sciences',category:'Humanities'},
  {name:'Life Skills',category:'Wellbeing'},
  {name:'Coding and Robotics',category:'Technology',notes:'Included where implemented by the school / current DBE rollout'},
  {name:'South African Sign Language',category:'Language',notes:'Visual/sign-language curriculum where applicable'}
];

const senior: SubjectDefinition[] = [
  language('Home Language'),
  language('First Additional Language',officialLanguageSubjects.filter(x=>x!=='South African Sign Language')),
  {name:'Mathematics',category:'Core'},
  {name:'Natural Sciences',category:'Science'},
  {name:'Social Sciences',category:'Humanities'},
  {name:'Technology',category:'Technology'},
  {name:'Economic and Management Sciences',category:'Commerce'},
  {name:'Life Orientation',category:'Wellbeing'},
  {name:'Creative Arts',category:'Arts'},
  {name:'Coding and Robotics',category:'Technology',notes:'Included where implemented by the school / current DBE rollout'},
  {name:'South African Sign Language',category:'Language',notes:'Visual/sign-language curriculum where applicable'}
];

const fet: SubjectDefinition[] = [
  language('Home Language'),
  language('First Additional Language',officialLanguageSubjects.filter(x=>x!=='South African Sign Language')),
  language('Second Additional Language',secondAdditionalLanguages,'Where offered by the institution'),
  {name:'South African Sign Language',category:'Language',notes:'Where offered'},
  {name:'Accounting',category:'Commerce'},
  {name:'Agricultural Management Practices',category:'Agriculture'},
  {name:'Agricultural Sciences',category:'Agriculture'},
  {name:'Agricultural Technology',category:'Agriculture'},
  {name:'Business Studies',category:'Commerce'},
  {name:'Civil Technology',category:'Technical'},
  {name:'Computer Applications Technology',category:'Technology'},
  {name:'Consumer Studies',category:'Vocational'},
  {name:'Dance Studies',category:'Arts'},
  {name:'Design',category:'Arts'},
  {name:'Dramatic Arts',category:'Arts'},
  {name:'Economics',category:'Commerce'},
  {name:'Electrical Technology',category:'Technical'},
  {name:'Engineering Graphics and Design',category:'Technical'},
  {name:'Equine Studies',category:'Vocational'},
  {name:'Geography',category:'Humanities'},
  {name:'History',category:'Humanities'},
  {name:'Hospitality Studies',category:'Vocational'},
  {name:'Information Technology',category:'Technology'},
  {name:'Life Orientation',category:'Wellbeing'},
  {name:'Life Sciences',category:'Science'},
  {name:'Marine Sciences',category:'Science'},
  {name:'Maritime Economics',category:'Commerce'},
  {name:'Mathematical Literacy',category:'Core'},
  {name:'Mathematics',category:'Core'},
  {name:'Mechanical Technology',category:'Technical'},
  {name:'Music',category:'Arts'},
  {name:'Nautical Science',category:'Science'},
  {name:'Physical Sciences',category:'Science'},
  {name:'Religion Studies',category:'Humanities'},
  {name:'Sport and Exercise Science',category:'Science'},
  {name:'Technical Mathematics',category:'Technical'},
  {name:'Technical Sciences',category:'Technical'},
  {name:'Technical: Civil Technology',category:'Technical'},
  {name:'Technical: Electrical Technology',category:'Technical'},
  {name:'Technical: Mechanical Technology',category:'Technical'},
  {name:'Tourism',category:'Vocational'},
  {name:'Visual Arts',category:'Arts'}
];

function curriculumFor(grade: Grade): GradeCurriculum {
  const n = grade === 'Grade R' ? 0 : Number(grade.replace('Grade ',''));
  if (n <= 3) return {grade, phase:'Foundation Phase', subjects:foundation};
  if (n <= 6) return {grade, phase:'Intermediate Phase', subjects:intermediate};
  if (n <= 9) return {grade, phase:'Senior Phase', subjects:senior};
  return {grade, phase:'FET Phase', subjects:fet};
}

export const curriculumRegistry: GradeCurriculum[] = grades.map(curriculumFor);

export function getCurriculum(grade: Grade) {
  return curriculumRegistry.find(item => item.grade === grade) || curriculumRegistry[0];
}

export function getAllSubjectNames() {
  return [...new Set(curriculumRegistry.flatMap(item => item.subjects.flatMap(s => [s.name,...(s.variants||[])])))].sort((a,b)=>a.localeCompare(b));
}

export const curriculumSources = [
  {label:'DBE National Curriculum Statements Grades R–12', url:'https://www.education.gov.za/Curriculum/CAPS/tabid/419/Default.aspx'},
  {label:'DBE Curriculum and Assessment Policy Statements (CAPS)', url:'https://www.education.gov.za/Curriculum/NCSGradesR12/CAPS/tabid/420/Default.aspx'},
  {label:'DBE CAPS – Intermediate Phase', url:'https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements%28CAPS%29/CAPSIntermediate.aspx'},
  {label:'DBE CAPS – Senior Phase', url:'https://www.education.gov.za/Curriculum/NCSGradesR12/CAPSSenior/tabid/573/Default.aspx'},
  {label:'DBE CAPS – FET Phase', url:'https://www.education.gov.za/Curriculum/NCSGradesR12/CAPSFET/tabid/570/Default.aspx'}
];
