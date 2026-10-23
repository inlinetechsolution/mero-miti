import SwiftUI

public struct MeroMitiDateField: View {
    @Binding public var text: String
    public var label: String?
    public var placeholder: String = "DD/MM/YYYY"
    public var format: String = "DD/MM/YYYY"
    public var locale: String = "ne"
    public var onBsDateChange: ((BsDate) -> Void)?
    public var onAdDateChange: ((Date) -> Void)?

    @State private var showPopover = false
    @State private var errorMessage: String? = nil
    @State private var currentBsDate: BsDate

    private let primaryColor = Color(red: 16/255, green: 185/255, blue: 129/255)

    public init(
        text: Binding<String>,
        label: String? = nil,
        placeholder: String = "DD/MM/YYYY",
        format: String = "DD/MM/YYYY",
        locale: String = "ne",
        onBsDateChange: ((BsDate) -> Void)? = nil,
        onAdDateChange: ((Date) -> Void)? = nil
    ) {
        self._text = text
        self.label = label
        self.placeholder = placeholder
        self.format = format
        self.locale = locale
        self.onBsDateChange = onBsDateChange
        self.onAdDateChange = onAdDateChange
        self._currentBsDate = State(initialValue: MeroMitiCore.adToBs(date: Date()))
    }

    private func applyMask(_ raw: String) {
        let clean = MeroMitiCore.toEnglishDigits(raw).filter { $0.isNumber }
        let sep: Character = format.contains(".") ? "." : "/"
        var masked = ""

        if format.hasPrefix("YYYY") {
            if !clean.isEmpty { masked += clean.prefix(4) }
            if clean.count > 4 {
                let start = clean.index(clean.startIndex, offsetBy: 4)
                let end = clean.index(start, offsetBy: min(2, clean.count - 4))
                masked += String(sep) + clean[start..<end]
            }
            if clean.count > 6 {
                let start = clean.index(clean.startIndex, offsetBy: 6)
                let end = clean.index(start, offsetBy: min(2, clean.count - 6))
                masked += String(sep) + clean[start..<end]
            }
        } else {
            if !clean.isEmpty { masked += clean.prefix(2) }
            if clean.count > 2 {
                let start = clean.index(clean.startIndex, offsetBy: 2)
                let end = clean.index(start, offsetBy: min(2, clean.count - 2))
                masked += String(sep) + clean[start..<end]
            }
            if clean.count > 4 {
                let start = clean.index(clean.startIndex, offsetBy: 4)
                let end = clean.index(start, offsetBy: min(4, clean.count - 4))
                masked += String(sep) + clean[start..<end]
            }
        }

        self.text = masked

        if masked.count >= 10 {
            let parts = masked.split(separator: sep).map { String($0) }
            if parts.count == 3 {
                let y: Int, m: Int, d: Int
                if format.hasPrefix("YYYY") {
                    y = Int(parts[0]) ?? 0
                    m = Int(parts[1]) ?? 0
                    d = Int(parts[2]) ?? 0
                } else {
                    d = Int(parts[0]) ?? 0
                    m = Int(parts[1]) ?? 0
                    y = Int(parts[2]) ?? 0
                }

                let bs = BsDate(year: y, month: m, day: d)
                let res = MeroMitiCore.validateBsDate(bs: bs, locale: locale)
                if res.isValid {
                    errorMessage = nil
                    currentBsDate = bs
                    onBsDateChange?(bs)
                    onAdDateChange?(MeroMitiCore.bsToAd(bs: bs))
                } else {
                    errorMessage = res.error
                }
            }
        } else {
            errorMessage = nil
        }
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                Text(label)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
            }

            HStack(spacing: 8) {
                // Inline [वि.सं.] / [B.S.] Pill Badge
                Text(locale == "ne" ? "वि.सं." : "B.S.")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(primaryColor)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 3)
                    .background(primaryColor.opacity(0.12))
                    .cornerRadius(4)

                // Input Field
                TextField(placeholder, text: Binding(
                    get: { self.text },
                    set: { self.applyMask($0) }
                ))
                .font(.system(size: 15))

                // Calendar popover trigger
                Button(action: { showPopover.toggle() }) {
                    Image(systemName: "calendar")
                        .font(.system(size: 18))
                        .foregroundColor(primaryColor)
                }
                .sheet(isPresented: $showPopover) {
                    MeroMitiDatePicker(
                        selectedDate: $currentBsDate,
                        locale: locale,
                        onSelect: { selectedBs in
                            currentBsDate = selectedBs
                            text = MeroMitiCore.formatBsDate(bs: selectedBs, format: format)
                            errorMessage = nil
                            onBsDateChange?(selectedBs)
                            onAdDateChange?(MeroMitiCore.bsToAd(bs: selectedBs))
                        },
                        onDismiss: { showPopover = false }
                    )
                    .padding()
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            .background(Color(UIColor.systemBackground))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(errorMessage != nil ? Color.red : Color(UIColor.separator), lineWidth: 1)
            )

            if let error = errorMessage {
                Text(error)
                    .font(.caption2)
                    .foregroundColor(.red)
            }
        }
    }
}
