import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class FormUtils {
  // ======================
  // 📌 Patrones comunes
  // ======================
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)'; // Nombre y apellido
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static strongPasswordPattern =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|:;"\'<>,.?/]).{8,}$';


  // ======================
  // 📌 Mostrar errores
  // ======================
    static getTextError(errors: ValidationErrors): string | null {
        for (const key of Object.keys(errors)) {
            switch (key) {
            case 'required':
                return 'Este campo es requerido';
            case 'minlength':
                return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
            case 'maxlength':
                return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
            case 'min':
                return `Valor mínimo: ${errors['min'].min}`;
            case 'max':
                return `Valor máximo: ${errors['max'].max}`;
            case 'email':
                return 'Formato de correo inválido';
            case 'pattern':
                if (errors['pattern'].requiredPattern === FormUtils.strongPasswordPattern) {
                return 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial';
                }
                if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
                return 'El valor ingresado no luce como un correo electrónico';
                }
                return 'El valor no cumple con el formato requerido';
            case 'passwordsNotEqual':
                return 'Las contraseñas no coinciden';
            case 'emailTaken':
                return 'El correo ya está en uso';
            default:
                return `Error de validación: ${key}`;
            }
        }
        return null;
    }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName]?.errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);
  }

  // Para FormArrays (ej. lista de teléfonos, direcciones, etc.)
  static isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    return !!formArray.controls[index]?.errors && formArray.controls[index].touched;
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null;
    const errors = formArray.controls[index].errors ?? {};
    return FormUtils.getTextError(errors);
  }

  // ======================
  // 📌 Validadores custom
  // ======================

  /** Valida que dos campos tengan el mismo valor (ej: password y password2) */
  static isFieldOneEqualFieldTwo(field1: string, field2: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
    const field1Value = formGroup.get(field1)?.value;
    const field2Control = formGroup.get(field2) as AbstractControl | null;

    if (!field2Control) return null;

    if (field1Value !== field2Control.value) {
      field2Control.setErrors({ passwordsNotEqual: true });
      return { passwordsNotEqual: true };
    } else {
      // Limpiar error si ya coinciden
      if (field2Control.hasError('passwordsNotEqual')) {
        field2Control.setErrors(null);
      }
      return null;
    }
  };
}
  /** Simulación de validación asíncrona contra servidor */
  static async checkingServerResponse(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // delay de 2s
    if (control.value === 'test@correo.com') {
      return { emailTaken: true };
    }
    return null;
  }

  /** Ejemplo: no permitir un username específico */
  static notAllowedUsername(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.toLowerCase();
    return value === 'admin' ? { notAllowed: true } : null;
  }
}
