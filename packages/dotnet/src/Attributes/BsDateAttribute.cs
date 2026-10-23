using System;
using System.ComponentModel.DataAnnotations;
using DataAnnotationsResult = System.ComponentModel.DataAnnotations.ValidationResult;

namespace MeroMiti.Attributes
{
    /// <summary>
    /// ASP.NET Core ValidationAttribute for validating Bikram Sambat (B.S.) date strings on DTOs and ViewModels.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public class BsDateAttribute : ValidationAttribute
    {
        public string Format { get; set; } = "DD/MM/YYYY";
        public string Locale { get; set; } = "ne";

        public BsDateAttribute() : base("The {0} field is not a valid Nepali (B.S.) date.")
        {
        }

        public BsDateAttribute(string format) : this()
        {
            Format = format;
        }

        protected override DataAnnotationsResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || (value is string str && string.IsNullOrWhiteSpace(str)))
            {
                return DataAnnotationsResult.Success; // [Required] attribute should handle null/empty checks
            }

            var dateStr = value.ToString()!;
            var result = MeroMitiCore.ParseBsDate(dateStr, Format, Locale);

            if (!result.IsValid)
            {
                var error = result.Error ?? FormatErrorMessage(validationContext.DisplayName);
                return new DataAnnotationsResult(error, new[] { validationContext.MemberName ?? string.Empty });
            }

            return DataAnnotationsResult.Success;
        }
    }
}
