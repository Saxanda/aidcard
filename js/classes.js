
export class Modal {
    show() {
        // Логіка для відображення модального вікна
    }

    hide() {
        // Логіка для приховування модального вікна
    }
}

export class Visit {
    constructor(doctor, purpose, description, urgency, fullName) {
        this.doctor = doctor;
        this.purpose = purpose;
        this.description = description;
        this.urgency = urgency;
        this.fullName = fullName;
    }

    render() {
        // Логіка для відображення картки візиту
    }
}

export class VisitDentist extends Visit {
    constructor(doctor, purpose, description, urgency, fullName, lastVisitDate) {
        super(doctor, purpose, description, urgency, fullName);
        this.lastVisitDate = lastVisitDate;
    }
}

export class VisitCardiologist extends Visit {
    constructor(doctor, purpose, description, urgency, fullName, bloodPressure, bmi, heartDiseases, age) {
        super(doctor, purpose, description, urgency, fullName);
        this.bloodPressure = bloodPressure;
        this.bmi = bmi;
        this.heartDiseases = heartDiseases;
        this.age = age;
    }
}

export class VisitTherapist extends Visit {
    constructor(doctor, purpose, description, urgency, fullName, age) {
        super(doctor, purpose, description, urgency, fullName);
        this.age = age;
    }
}
