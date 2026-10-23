namespace MeroMiti
{
    public readonly struct AdDate : System.IEquatable<AdDate>
    {
        public int Year { get; }
        public int Month { get; }
        public int Day { get; }

        public AdDate(int year, int month, int day)
        {
            Year = year;
            Month = month;
            Day = day;
        }

        public override string ToString() => $"{Year:D4}-{Month:D2}-{Day:D2}";

        public bool Equals(AdDate other) => Year == other.Year && Month == other.Month && Day == other.Day;

        public override bool Equals(object? obj) => obj is AdDate other && Equals(other);

        public override int GetHashCode() => (Year, Month, Day).GetHashCode();

        public static bool operator ==(AdDate left, AdDate right) => left.Equals(right);

        public static bool operator !=(AdDate left, AdDate right) => !left.Equals(right);
    }
}
