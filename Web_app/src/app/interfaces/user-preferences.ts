export interface UserPreferences {
  success: boolean;
  preferences: {
    oneTimeMonitChecked: boolean;
    selectedCategories: string[];
    selectedSubCategories: string[];
  };
}
