namespace MeroMiti
{
    public class ValidationResult
    {
        public bool IsValid { get; }
        public string? Error { get; }
        public BsDate? Parsed { get; }

        public ValidationResult(bool isValid, string? error = null, BsDate? parsed = null)
        {
            IsValid = isValid;
            Error = error;
            Parsed = parsed;
        }
    }
}
