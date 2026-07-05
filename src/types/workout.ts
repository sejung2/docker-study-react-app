export const WorkoutType = {
  GYM: 'GYM',
  SPORTS: 'SPORTS',
} as const;
export type WorkoutType = (typeof WorkoutType)[keyof typeof WorkoutType];

export const BodyPart = {
  CHEST: 'CHEST',
  BACK: 'BACK',
  LEGS: 'LEGS',
  SHOULDERS: 'SHOULDERS',
  BICEPS: 'BICEPS',
  TRICEPS: 'TRICEPS',
} as const;
export type BodyPart = (typeof BodyPart)[keyof typeof BodyPart];

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  CHEST: '가슴',
  BACK: '등',
  LEGS: '하체',
  SHOULDERS: '어깨',
  BICEPS: '이두',
  TRICEPS: '삼두',
};

export interface WorkoutCheck {
  id: string;
  workoutType: WorkoutType;
  bodyParts: BodyPart[];
  date: string;
  createdAt: string;
}

export interface CreateWorkoutDto {
  workoutType: WorkoutType;
  bodyParts?: BodyPart[];
}

export interface UpdateWorkoutDto {
  workoutType?: WorkoutType;
  bodyParts?: BodyPart[];
}
