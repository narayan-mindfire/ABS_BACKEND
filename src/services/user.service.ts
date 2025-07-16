import { UserRepository } from "../repositories/user.repository";
import { UserType } from "../types/models";

export const UserService = {
  async getUsers(user_type?: string) {
    if (!user_type) return UserRepository.findAll();

    if (user_type !== UserType.Doctor && user_type !== UserType.Patient) {
      throw new Error("user_type must be either doctor or patient");
    }

    const users = await UserRepository.findUsersByType(user_type as UserType);
    const userIds = users.map((u: { _id: { toString: () => any } }) =>
      u._id.toString()
    );

    if (user_type === UserType.Doctor) {
      const doctorDetails = await UserRepository.findDoctorDetails(userIds);
      return users.map(
        (user: { _id: { toString: () => string }; toObject: () => any }) => {
          const doc = doctorDetails.find(
            (d) => d.doctor_id.toString() === user._id.toString()
          );
          return {
            ...user.toObject(),
            specialization: doc?.specialization,
            bio: doc?.bio,
          };
        }
      );
    }

    const patientDetails = await UserRepository.findPatientDetails(userIds);
    return users.map(
      (user: { _id: { toString: () => string }; toObject: () => any }) => {
        const pat = patientDetails.find(
          (p) => p.patient_id.toString() === user._id.toString()
        );
        return {
          ...user.toObject(),
          gender: pat?.gender,
          date_of_birth: pat?.date_of_birth,
        };
      }
    );
  },

  async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");

    const profile = await this.getProfileData(
      user.user_type,
      user._id.toString()
    );
    return { ...user.toObject(), ...profile };
  },

  async updateUser(id: string, body: any) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");

    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      specialization,
      bio,
      gender,
      date_of_birth,
    } = body;

    const updatedUser = await UserRepository.updateUser(id, {
      first_name,
      last_name,
      email,
      phone_number,
      password,
    });

    if (user.user_type === UserType.Doctor) {
      await UserRepository.updateDoctorProfile(id, { specialization, bio });
    }

    if (user.user_type === UserType.Patient) {
      await UserRepository.updatePatientProfile(id, { gender, date_of_birth });
    }

    return updatedUser;
  },

  async deleteUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User to be deleted doesn't exist");

    if (user.user_type === UserType.Doctor) {
      await UserRepository.deleteDoctorProfile(id);
    } else if (user.user_type === UserType.Patient) {
      await UserRepository.deletePatientProfile(id);
    } else {
      throw new Error("user_type must be either doctor or patient");
    }

    await UserRepository.deleteUser(id);
  },

  async getProfileData(user_type: UserType, id: string) {
    if (user_type === UserType.Doctor) {
      const doc = await UserRepository.findDoctorByUserId(id);
      return doc ? { specialization: doc.specialization, bio: doc.bio } : {};
    }

    if (user_type === UserType.Patient) {
      const pat = await UserRepository.findPatientByUserId(id);
      return pat
        ? { gender: pat.gender, date_of_birth: pat.date_of_birth }
        : {};
    }

    return {};
  },
};
