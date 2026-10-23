namespace MeroMiti
{
    public readonly struct BsDate : System.IEquatable<BsDate>
    {
        public int Year { get; }
        public int Month { get; }
        public int Day { get; }

        public BsDate(int year, int month, int day)
        {
            Year = year;
            Month = month;
            Day = day;
        }

        public override string ToString() => $"{Year:D4}-{Month:D2}-{Day:D2}";

        public bool Equals(BsDate other) => Year == other.Year && Month == other.Month && Day == other.Day;

        public override bool Equals(object? obj) => obj is BsDate other && Equals(other);

        public override int GetHashCode() => (Year, Month, Day).GetHashCode();

        public static bool operator ==(BsDate left, BsDate right) => left.Equals(right);

        public static bool operator !=(BsDate left, BsDate right) => !left.Equals(right);
    }
}
