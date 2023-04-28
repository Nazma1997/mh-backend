import mongoose from "mongoose";

export interface RequestEmployeeDocument {
    requestClientId: mongoose.Types.ObjectId;
    employeeIds: [mongoose.Types.ObjectId];
    employees: typeof EmployeeSchema;
    clientRequestDetails: [typeof ClientRequestDetailsSchema];
    suggestedEmployeeDetails: [typeof EmployeeSchema];
    clientDetails: typeof RestaurantSchema;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export interface RequestEmployeeStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    positionId: {
        type: mongoose.Types.ObjectId,
    },
    positionName: {
        type: String,
    },
    presentAddress: String,
    permanentAddress: String,
    employeeExperience: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    totalWorkingHour: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    profilePicture: String,
    cv: String,
});

const RestaurantSchema = new mongoose.Schema({
    requestClientId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    lat: {
        type: String,
    },
    long: {
        type: String,
    }
});

const ClientRequestDetailsSchema = new mongoose.Schema({
    positionId: {
        type: mongoose.Types.ObjectId,
    },
    positionName: {
        type: String,
    },
    numOfEmployee: {
        type: Number,
    }
});

export const RequestEmployeeSchema = new mongoose.Schema(
    {
        requestClientId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        clientDetails: RestaurantSchema,
        suggestedEmployeeDetails: [EmployeeSchema], //when update hr or admin then set to the object
        clientRequestDetails: [ClientRequestDetailsSchema], //when request client then set to the object
        active: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const RequestEmployee = mongoose.model<RequestEmployeeDocument>("request-employees", RequestEmployeeSchema);

export default RequestEmployee;