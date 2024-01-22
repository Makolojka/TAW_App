export interface User {
  name: string;
  email: string;
  id: string;
  preferences: {
    oneTimeMonitChecked: boolean;
    selectedCategories: string[];
    selectedSubCategories: string[];
  };
}
