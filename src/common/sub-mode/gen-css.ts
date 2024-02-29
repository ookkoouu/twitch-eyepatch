import fs from "node:fs";
import path from "node:path";
import { Selector } from "../../lib/twitch";

export const privilegeBadges: Record<string, string[]> = {
	"en-US": ["Broadcaster", "Subscriber", "Verified", "Moderator"],
	"da-DK": ["Indholdsudbyder", "Subscriber", "Bekræftet", "Moderator"],
	"de-DE": ["Broadcaster", "Subscriber", "Verifiziert", "Moderator"],
	"en-GB": ["Broadcaster", "Subscriber", "Verified", "Moderator"],
	"es-ES": ["Emisor", "Subscriber", "Verificado", "Moderador"],
	"es-MX": ["Emisor", "Subscriber", "Verificado", "Moderador"],
	"fr-FR": ["Diffuseur", "Subscriber", "Vérifié", "Modérateur"],
	"it-IT": ["Emittente", "Subscriber", "Verificato", "Moderatore"],
	"hu-HU": ["Közvetítő", "Subscriber", "Hitelesített", "Moderátor"],
	"nl-NL": ["Uitzender", "Subscriber", "Geverifieerd", "Moderator"],
	"no-NO": ["Kringkaster", "Subscriber", "Bekreftet", "Moderator"],
	"pl-PL": ["Nadawca", "Subscriber", "Zweryfikowane", "Moderator"],
	"pt-PT": ["Emissor", "Subscriber", "Confirmado", "Moderador"],
	"pt-BR": ["Emissora", "Subscriber", "Verificado", "Moderador"],
	"ro-RO": ["Emiţător", "Subscriber", "Verificat", "Moderator"],
	"sk-SK": ["Vysielateľ", "Subscriber", "Overené", "Moderátor"],
	"fi-FI": ["Lähettäjä", "Subscriber", "Vahvistettu kumppani", "Moderaattori"],
	"sv-SE": ["Sändare", "Subscriber", "Verifierad", "Moderator"],
	"vi-VN": ["Đài phát", "Subscriber", "Đã xác minh", "Người điều hành"],
	"tr-TR": ["Yayınlayan", "Subscriber", "Doğrulandı", "Moderatör"],
	"cs-CZ": ["Vysílající uživatel", "Subscriber", "Ověřeno", "Moderátor"],
	"el-GR": ["Broadcaster", "Subscriber", "Επαληθεύτηκε", "Επόπτης"],
	"bg-BG": ["Излъчващ играч", "Subscriber", "Проверено", "Модератор"],
	"ru-RU": ["Владелец канала", "Subscriber", "Подтверждено", "Модератор"],
	"th-TH": ["นักจัดรายการ", "Subscriber", "ยืนยันแล้ว", "ผู้ดำเนินรายการ"],
	"zh-CN": ["直播者", "Subscriber", "已验证", "管理员"],
	"zh-TW": ["轉播", "Subscriber", "已驗證", "管理員"],
	"ja-JP": ["ストリーマー", "サブスクライバー", "認証済み", "モデレーター"],
	"ko-KR": ["스트리머", "Subscriber", "인증 완료", "매니저"],
};

const chatContainers = [
	Selector.LiveChat,
	Selector.VodChat,
	Selector.ClipsChat,
];

function generateCss() {
	let res = "";
	res += `${chatContainers.join(",")}{display:none}`;
	res += Object.entries(privilegeBadges)
		.map(([lang, alts]) => {
			const badges = alts.map((e) => `img.chat-badge[alt*="${e}"]`).join(",");
			const ctns = chatContainers
				.map((e) => `${e}:has(${badges}){display:block}`)
				.join("\n");
			return `html[lang=${lang}]{${ctns}}`;
		})
		.join("\n");

	return res;
}

fs.writeFileSync(
	path.join(import.meta.dirname, "sub-mode.gen.css"),
	generateCss(),
	{
		encoding: "utf8",
	},
);
