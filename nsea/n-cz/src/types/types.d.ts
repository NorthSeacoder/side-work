export interface Scope {
    name: String;
    value: String;
}

export interface Option {
    types?: Object;
    defaultType?: String;
    defaultScope?: String;
    scopes?: Array<Scope>;
}
export interface Type {
    description?: String;
    title?: String;
}
export interface Answer {
    type?: String;
    scope?: String;
    message?: String;
}

export interface ChangeFile {
    committedFiles: string[];
    unCommittedFiles: string[];
}
export interface WorkspaceWeight {
    [key: string]: number;
}