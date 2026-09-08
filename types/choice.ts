export interface Choice {
  _id?: string;
  userId: string;
  name: string;
  category?: string;
  createdAt: string;
}

export interface DecisionHistory {
  _id?: string;
  userId: string;
  choiceId: string;
  result: string;
  decisionAt: string;
}
