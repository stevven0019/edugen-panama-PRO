import individualPosterLinks from './individualPosterLinks.json';

// Official Google Drive links for posters and workbooks
export const MAIN_POSTERS_DRIVE_URL = "https://drive.google.com/drive/folders/1lEZYaHlLbXUxfINxoffyJdlHg8BggDaM?usp=drive_link";

export const GRADE_POSTERS_DRIVE_URLS = {
  "Pre-K": {
    folderId: "1mAi-cWME4sRfZLOzc9sgKOEjQYITk7NB",
    url: "https://drive.google.com/drive/folders/1mAi-cWME4sRfZLOzc9sgKOEjQYITk7NB?usp=drive_link",
    title: "Prekínder"
  },
  "Prekinder": {
    folderId: "1mAi-cWME4sRfZLOzc9sgKOEjQYITk7NB",
    url: "https://drive.google.com/drive/folders/1mAi-cWME4sRfZLOzc9sgKOEjQYITk7NB?usp=drive_link",
    title: "Prekínder"
  },
  "Kinder": {
    folderId: "1Ufi37xwwShm-Zv-BnZeDbx7QrGHOOU8m",
    url: "https://drive.google.com/drive/folders/1Ufi37xwwShm-Zv-BnZeDbx7QrGHOOU8m?usp=drive_link",
    title: "Kínder"
  },
  "1st Grade": {
    folderId: "1jX9M-GLo8U1NxOMzBIArhnu777AsmDKS",
    url: "https://drive.google.com/drive/folders/1jX9M-GLo8U1NxOMzBIArhnu777AsmDKS?usp=drive_link",
    title: "1° Grado"
  },
  "2nd Grade": {
    folderId: "10lc7h2XfBGYfn9pDKmLzq2s2P_syLxfi",
    url: "https://drive.google.com/drive/folders/10lc7h2XfBGYfn9pDKmLzq2s2P_syLxfi?usp=drive_link",
    title: "2° Grado"
  },
  "3rd Grade": {
    folderId: "1d68VbpBFnp67ncxTXf5BnhkiQ1KMBVLN",
    url: "https://drive.google.com/drive/folders/1d68VbpBFnp67ncxTXf5BnhkiQ1KMBVLN?usp=drive_link",
    title: "3° Grado"
  },
  "4th Grade": {
    folderId: "1w_tw3b2oz_10WyEQ6X4zDNMKX-6zHFtq",
    url: "https://drive.google.com/drive/folders/1w_tw3b2oz_10WyEQ6X4zDNMKX-6zHFtq?usp=drive_link",
    title: "4° Grado"
  },
  "5th Grade": {
    folderId: "1CQfjWoTZuHauoBi4yKMCnL_L9HPzr9-N",
    url: "https://drive.google.com/drive/folders/1CQfjWoTZuHauoBi4yKMCnL_L9HPzr9-N?usp=drive_link",
    title: "5° Grado"
  },
  "6th Grade": {
    folderId: "1crQHrS4JWhhLhkXOkMd2MmUCZgkKu5am",
    url: "https://drive.google.com/drive/folders/1crQHrS4JWhhLhkXOkMd2MmUCZgkKu5am?usp=drive_link",
    title: "6° Grado"
  },
  "7th Grade": {
    folderId: "1b3EFpLggPS3LtmpnQekin66YuuIQ7vNF",
    url: "https://drive.google.com/drive/folders/1b3EFpLggPS3LtmpnQekin66YuuIQ7vNF?usp=drive_link",
    title: "7° Grado"
  },
  "8th Grade": {
    folderId: "17Z6XSxa9UKkaVn7MkWBJ9HjALkaJGT0o",
    url: "https://drive.google.com/drive/folders/17Z6XSxa9UKkaVn7MkWBJ9HjALkaJGT0o?usp=drive_link",
    title: "8° Grado"
  },
  "9th Grade": {
    folderId: "1xHs_b7JuFLkgkTcMEK6xR_LRHT1wa_8-",
    url: "https://drive.google.com/drive/folders/1xHs_b7JuFLkgkTcMEK6xR_LRHT1wa_8-?usp=drive_link",
    title: "9° Grado"
  },
  "10th Grade": {
    folderId: "1MGidHi8AWy_Mk9Q6eHUFFTK-Z5ZV7WdJ",
    url: "https://drive.google.com/drive/folders/1MGidHi8AWy_Mk9Q6eHUFFTK-Z5ZV7WdJ?usp=drive_link",
    title: "10° Grado"
  },
  "11th Grade": {
    folderId: "1laOQEhdkUDbjt5nZXQqjcS2Pk9QQjQ6x",
    url: "https://drive.google.com/drive/folders/1laOQEhdkUDbjt5nZXQqjcS2Pk9QQjQ6x?usp=drive_link",
    title: "11° Grado"
  },
  "12th Grade": {
    folderId: "14FYq3y70p-L7cHMXxjvroIerO1SlaOaS",
    url: "https://drive.google.com/drive/folders/14FYq3y70p-L7cHMXxjvroIerO1SlaOaS?usp=drive_link",
    title: "12° Grado"
  }
};

export const normalizeGradeKey = (gradeKey) => {
  if (!gradeKey) return '4th Grade';
  const clean = String(gradeKey).trim();
  if (clean === 'Pre-K' || clean === 'Pre-Kinder' || clean.toLowerCase() === 'prekínder' || clean.toLowerCase() === 'prekinder') {
    return 'Prekinder';
  }
  if (clean.toLowerCase() === 'kínder' || clean.toLowerCase() === 'kinder') {
    return 'Kinder';
  }
  // If e.g. "4° Grado" -> convert to "4th Grade"
  const m = clean.match(/^(\d+)/);
  if (m) {
    const num = parseInt(m[1], 10);
    const suffixes = { 1: '1st', 2: '2nd', 3: '3rd' };
    const suffix = suffixes[num] || `${num}th`;
    return `${suffix} Grade`;
  }
  return clean;
};

export const getGradeDriveUrl = (gradeKey) => {
  if (!gradeKey) return MAIN_POSTERS_DRIVE_URL;
  const norm = normalizeGradeKey(gradeKey);
  return GRADE_POSTERS_DRIVE_URLS[norm]?.url || GRADE_POSTERS_DRIVE_URLS[gradeKey]?.url || MAIN_POSTERS_DRIVE_URL;
};

export const getScenarioPosterLinks = (gradeKey, scenarioNumber) => {
  const norm = normalizeGradeKey(gradeKey);
  const gradeData = individualPosterLinks[norm];
  if (!gradeData) return null;
  return gradeData[String(scenarioNumber)] || null;
};

export { individualPosterLinks };
