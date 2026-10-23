import SwiftUI

public struct MeroMitiDatePicker: View {
    @Binding public var selectedDate: BsDate
    public var onSelect: ((BsDate) -> Void)?
    public var onDismiss: (() -> Void)?

    @State private var displayedYear: Int
    @State private var displayedMonth: Int
    @State private var locale: String

    private let primaryColor = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981

    public init(
        selectedDate: Binding<BsDate>,
        locale: String = "ne",
        onSelect: ((BsDate) -> Void)? = nil,
        onDismiss: (() -> Void)? = nil
    ) {
        self._selectedDate = selectedDate
        self._displayedYear = State(initialValue: selectedDate.wrappedValue.year)
        self._displayedMonth = State(initialValue: selectedDate.wrappedValue.month)
        self._locale = State(initialValue: locale)
        self.onSelect = onSelect
        self.onDismiss = onDismiss
    }

    private var isNepali: Bool { locale == "ne" }
    private var monthNames: [String] {
        isNepali ? MeroMitiCore.nepaliMonthsNp : MeroMitiCore.nepaliMonthsEn
    }
    private var weekdayNames: [String] {
        isNepali ? MeroMitiCore.nepaliDaysShortNp : MeroMitiCore.nepaliDaysShortEn
    }

    private var daysInMonth: Int {
        MeroMitiCore.getDaysInBsMonth(year: displayedYear, month: displayedMonth)
    }

    private var startWeekday: Int {
        let firstAd = MeroMitiCore.bsToAd(bs: BsDate(year: displayedYear, month: displayedMonth, day: 1))
        let weekday = Calendar(identifier: .gregorian).component(.weekday, from: firstAd)
        // 1=Sunday, 7=Saturday -> 0-indexed: 0=Sunday ... 6=Saturday
        return weekday - 1
    }

    private var todayBs: BsDate {
        MeroMitiCore.adToBs(date: Date())
    }

    public var body: some View {
        VStack(spacing: 16) {
            // Header: Month/Year navigation & Language toggle
            HStack {
                Button(action: {
                    if displayedMonth > 1 {
                        displayedMonth -= 1
                    } else {
                        displayedMonth = 12
                        displayedYear -= 1
                    }
                }) {
                    Text("◀")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(primaryColor)
                        .padding(6)
                }

                Spacer()

                Text("\(monthNames[displayedMonth - 1]) \(isNepali ? MeroMitiCore.toNepaliDigits(String(displayedYear)) : String(displayedYear))")
                    .font(.headline)
                    .fontWeight(.bold)

                Spacer()

                Button(action: {
                    if displayedMonth < 12 {
                        displayedMonth += 1
                    } else {
                        displayedMonth = 1
                        displayedYear += 1
                    }
                }) {
                    Text("▶")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(primaryColor)
                        .padding(6)
                }

                // Language toggle pill
                Button(action: {
                    locale = isNepali ? "en" : "ne"
                }) {
                    Text(isNepali ? "EN" : "ने")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(primaryColor.opacity(0.15))
                        .foregroundColor(primaryColor)
                        .cornerRadius(4)
                }
            }
            .padding(.horizontal, 8)

            // Weekday labels
            HStack {
                ForEach(0..<7, id: \.self) { index in
                    Text(weekdayNames[index])
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .foregroundColor(index == 6 ? Color.red : Color.secondary)
                        .frame(maxWidth: .infinity)
                }
            }

            // Days Grid
            let columns = Array(repeating: GridItem(.flexible(), spacing: 4), count: 7)
            LazyVGrid(columns: columns, spacing: 6) {
                ForEach(0..<startWeekday, id: \.self) { _ in
                    Color.clear
                        .frame(height: 36)
                }

                ForEach(1...daysInMonth, id: \.self) { day in
                    let weekday = (startWeekday + day - 1) % 7
                    let isSaturday = weekday == 6
                    let isSelected = selectedDate.year == displayedYear &&
                        selectedDate.month == displayedMonth &&
                        selectedDate.day == day
                    let isToday = todayBs.year == displayedYear &&
                        todayBs.month == displayedMonth &&
                        todayBs.day == day

                    Button(action: {
                        let newDate = BsDate(year: displayedYear, month: displayedMonth, day: day)
                        selectedDate = newDate
                        onSelect?(newDate)
                    }) {
                        Text(isNepali ? MeroMitiCore.toNepaliDigits(String(day)) : "\(day)")
                            .font(.system(size: 14, weight: isSelected || isToday ? .bold : .regular))
                            .foregroundColor(
                                isSelected ? .white : (isSaturday ? .red : .primary)
                            )
                            .frame(maxWidth: .infinity, minHeight: 36)
                            .background(
                                isSelected ? primaryColor : Color.clear
                            )
                            .overlay(
                                isToday && !isSelected
                                    ? Circle().stroke(primaryColor, lineWidth: 1)
                                    : nil
                            )
                            .clipShape(Circle())
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }

            Divider()

            // Footer: Today & Dismiss
            HStack {
                Button(action: {
                    let today = todayBs
                    selectedDate = today
                    displayedYear = today.year
                    displayedMonth = today.month
                    onSelect?(today)
                }) {
                    Text(isNepali ? "आज (\(MeroMitiCore.toNepaliDigits(String(todayBs.day))) \(monthNames[todayBs.month - 1]))" : "Today")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(primaryColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .overlay(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(primaryColor, lineWidth: 1)
                        )
                }

                Spacer()

                if let onDismiss = onDismiss {
                    Button("Done", action: onDismiss)
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(primaryColor)
                }
            }
            .padding(.horizontal, 4)
        }
        .padding(16)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}
