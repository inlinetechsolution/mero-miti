using System;

namespace MeroMiti.Tests
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("--- 1. Testing C# 24-bit Decompression ---");
            var days2081 = MeroMitiCore.DecodeMonthDays("bb9512");
            var expected = new int[] { 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 };
            for (int i = 0; i < 12; i++)
            {
                if (days2081[i] != expected[i])
                {
                    Console.WriteLine($"❌ Mismatch at month {i + 1}: expected {expected[i]}, got {days2081[i]}");
                    Environment.Exit(1);
                }
            }
            Console.WriteLine("✔ 24-bit decoding passed!\n");

            Console.WriteLine("--- 2. Testing C# Conversions ---");
            // Anchor: 2023-04-14 AD -> 2080-01-01 BS
            var anchorAd = new DateTime(2023, 4, 14, 0, 0, 0, DateTimeKind.Utc);
            var bsAnchor = MeroMitiCore.AdToBs(anchorAd);
            if (bsAnchor != new BsDate(2080, 1, 1))
            {
                Console.WriteLine($"❌ Anchor AD->BS failed: got {bsAnchor}");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Anchor AD -> BS passed!");

            // Known: 2024-09-04 AD -> 2081-05-19 BS
            var knownAd = new DateTime(2024, 9, 4, 0, 0, 0, DateTimeKind.Utc);
            var bsKnown = MeroMitiCore.AdToBs(knownAd);
            if (bsKnown != new BsDate(2081, 5, 19))
            {
                Console.WriteLine($"❌ Known AD->BS failed: got {bsKnown}");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Known AD -> BS passed!");

            // Reverse: 2080-01-01 BS -> 2023-04-14 AD
            var adAnchorRev = MeroMitiCore.BsToAd(new BsDate(2080, 1, 1));
            if (adAnchorRev.ToString("yyyy-MM-dd") != "2023-04-14")
            {
                Console.WriteLine($"❌ Anchor BS->AD failed: got {adAnchorRev}");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Anchor BS -> AD passed!");

            // Reverse: 2081-05-19 BS -> 2024-09-04 AD
            var adKnownRev = MeroMitiCore.BsToAd(new BsDate(2081, 5, 19));
            if (adKnownRev.ToString("yyyy-MM-dd") != "2024-09-04")
            {
                Console.WriteLine($"❌ Known BS->AD failed: got {adKnownRev}");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Known BS -> AD passed!\n");

            Console.WriteLine("--- 3. Testing C# Validation & Dynamic Registration ---");
            MeroMitiCore.RegisterYear(2095, "bba445");
            var days2095 = MeroMitiCore.GetDaysInBsMonth(2095, 1);
            if (days2095 != 31)
            {
                Console.WriteLine($"❌ Dynamic RegisterYear failed: got {days2095}");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Dynamic RegisterYear passed!");

            var valid = MeroMitiCore.ValidateBsDate(new BsDate(2081, 5, 19));
            if (!valid.IsValid)
            {
                Console.WriteLine("❌ Valid date check failed");
                Environment.Exit(1);
            }

            var invalid = MeroMitiCore.ValidateBsDate(new BsDate(2081, 1, 32));
            if (invalid.IsValid)
            {
                Console.WriteLine("❌ Invalid date check failed (day 32 in Baishakh should be invalid)");
                Environment.Exit(1);
            }
            Console.WriteLine("✔ Validation passed!\n");

            Console.WriteLine("========================================");
            Console.WriteLine("🎉 ALL MERO MITI C# / .NET TESTS PASSED!");
            Console.WriteLine("========================================");
        }
    }
}
