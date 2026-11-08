import individualPosterLinks from './individualPosterLinks.json';

// Official EduGen Panama Google Drive account (edugenproai@gmail.com)
export const MAIN_POSTERS_DRIVE_URL = "https://drive.google.com/drive/folders/1tTV0x41azAQFtfxVOWJNppI_xWN_O9--?usp=drive_link";

export const GRADE_POSTERS_DRIVE_URLS = {
  "Pre-K": {
    folderId: "1dKgiFawiKnqAXR5Q0EGdI--3RIxAlHfC",
    url: "https://drive.google.com/drive/folders/1dKgiFawiKnqAXR5Q0EGdI--3RIxAlHfC?usp=drive_link",
    title: "Prekínder"
  },
  "Prekinder": {
    folderId: "1dKgiFawiKnqAXR5Q0EGdI--3RIxAlHfC",
    url: "https://drive.google.com/drive/folders/1dKgiFawiKnqAXR5Q0EGdI--3RIxAlHfC?usp=drive_link",
    title: "Prekínder"
  },
  "Kinder": {
    folderId: "13gJGgKcSyIxnWoZ_J-apMe7WrzO32gVq",
    url: "https://drive.google.com/drive/folders/13gJGgKcSyIxnWoZ_J-apMe7WrzO32gVq?usp=drive_link",
    title: "Kínder"
  },
  "1st Grade": {
    folderId: "11PLmjqgfLKMx1j2wOwvxJGeiOgqZNmBW",
    url: "https://drive.google.com/drive/folders/11PLmjqgfLKMx1j2wOwvxJGeiOgqZNmBW?usp=drive_link",
    title: "1° Grado"
  },
  "2nd Grade": {
    folderId: "1kMf9sTbjh8hOBQHec72DyxQOdKjJqBBc",
    url: "https://drive.google.com/drive/folders/1kMf9sTbjh8hOBQHec72DyxQOdKjJqBBc?usp=drive_link",
    title: "2° Grado"
  },
  "3rd Grade": {
    folderId: "1DzZqCdVl3mJwGSnw3RbdB4zzLDVTU87e",
    url: "https://drive.google.com/drive/folders/1DzZqCdVl3mJwGSnw3RbdB4zzLDVTU87e?usp=drive_link",
    title: "3° Grado"
  },
  "4th Grade": {
    folderId: "1dZcG50jd6VwUxXpwNcKWNQOR0EijdJP8",
    url: "https://drive.google.com/drive/folders/1dZcG50jd6VwUxXpwNcKWNQOR0EijdJP8?usp=drive_link",
    title: "4° Grado"
  },
  "5th Grade": {
    folderId: "1Zo1j2BwU-KaPvoVoH9ZJhchbmiRMPqDF",
    url: "https://drive.google.com/drive/folders/1Zo1j2BwU-KaPvoVoH9ZJhchbmiRMPqDF?usp=drive_link",
    title: "5° Grado"
  },
  "6th Grade": {
    folderId: "1GKuUPkwSMskKc8tZpSQ9gkGKGqvxsKFV",
    url: "https://drive.google.com/drive/folders/1GKuUPkwSMskKc8tZpSQ9gkGKGqvxsKFV?usp=drive_link",
    title: "6° Grado"
  },
  "7th Grade": {
    folderId: "1mUJX0B_hqWKX3zhJk010KNARPfyoS9sN",
    url: "https://drive.google.com/drive/folders/1mUJX0B_hqWKX3zhJk010KNARPfyoS9sN?usp=drive_link",
    title: "7° Grado"
  },
  "8th Grade": {
    folderId: "1f7edaQWWygwHn8yQuBw_5zplxnLawVDp",
    url: "https://drive.google.com/drive/folders/1f7edaQWWygwHn8yQuBw_5zplxnLawVDp?usp=drive_link",
    title: "8° Grado"
  },
  "9th Grade": {
    folderId: "1RCJoyuj44s2st1c4I-hyH2gYA8X10p90",
    url: "https://drive.google.com/drive/folders/1RCJoyuj44s2st1c4I-hyH2gYA8X10p90?usp=drive_link",
    title: "9° Grado"
  },
  "10th Grade": {
    folderId: "1zzf4zcaHfa9kSbBgDaxY3bQcU3cwXTUI",
    url: "https://drive.google.com/drive/folders/1zzf4zcaHfa9kSbBgDaxY3bQcU3cwXTUI?usp=drive_link",
    title: "10° Grado"
  },
  "11th Grade": {
    folderId: "1fYlXvdbb2JRrR3InHErD5kd4ArJ7veZv",
    url: "https://drive.google.com/drive/folders/1fYlXvdbb2JRrR3InHErD5kd4ArJ7veZv?usp=drive_link",
    title: "11° Grado"
  },
  "12th Grade": {
    folderId: "1eGt92wH7LwjA_BrBgzUd69B4VYk0BIeI",
    url: "https://drive.google.com/drive/folders/1eGt92wH7LwjA_BrBgzUd69B4VYk0BIeI?usp=drive_link",
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
