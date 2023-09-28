import { Box, Center, Heading, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { appInfo } from "consts/appconst";
import { memo, VFC } from "react";

export const TermsOfService: VFC = memo(() => {
  const headingFontSize = useBreakpointValue({ base: "xl", sm: "xl", md: "xl", lg: "2xl" });
  const textFontSize = ["sm", "md", "md", "xl"];
  return (
    <Box p={5}>
      <Center>
        <Heading mb={5} size={headingFontSize}>
          {`${appInfo.Info.appName}サービス利用規約`}
        </Heading>
      </Center>
      <VStack align="start" spacing={5}>
        <Text mb={5} fontSize={textFontSize}>
          {`この規約は、お客様が、私個人（アプリ制作者）が提供する「${appInfo.Info.appName}」サービス（以下「本サービス」）をご利用頂く際の取扱いにつき定めるものです。本規約に同意した上で本サービスをご利用ください。`}
        </Text>
        <Heading size="md" mb={2}>
          第１条（定義）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          本規約上で使用する用語の定義は、次に掲げるとおりとします。
          <br />
          （1）本サービス 私個人（アプリ制作者）が運営するサービス及び関連するサービス
          <br />
          （2）本サイト 本サービスのコンテンツが掲載されたウェブサイト
          <br />
          （3）本コンテンツ
          本サービス上で提供される文字、音、静止画、動画、ソフトウェアプログラム、コード等の総称（投稿情報を含む）
          <br />
          （4）利用者 本サービスを利用する全ての方
          <br />
          （5）登録利用者 本サイトの利用者登録が完了した方
          <br />
          （6）ＩＤ 本サービスの利用のために登録利用者が固有に持つ文字列
          <br />
          （7）パスワード ＩＤに対応して登録利用者が固有に設定する暗号
          <br />
          （8）個人情報 住所、氏名、職業、電話番号等個人を特定することのできる情報の総称
          <br />
          （9）登録情報 登録利用者が本サイトにて登録した情報の総称（投稿情報は除く）
          <br />
          （10）知的財産
          発明、考案、植物の新品種、意匠、著作物その他の人間の創造的活動により生み出されるもの（発見または解明がされた自然の法則または現象であって、産業上の利用可能性があるものを含む）、商標、商号その他事業活動に用いられる商品または役務を表示するもの及び営業秘密その他の事業活動に有用な技術上または営業上の情報
          <br />
          （11）知的財産権
          特許権、実用新案権、育成者権、意匠権、著作権、商標権その他の知的財産に関して法令により定められた権利または法律上保護される利益に係る権利
        </Text>
        <Heading size="md" mb={2}>
          第２条（本規約への同意）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １ 利用者は、本利用規約に同意頂いた上で、本サービスを利用できるものとします。
          <br />
          ２
          利用者が、本サービスをスマートフォンその他の情報端末にダウンロードし、本規約への同意手続を行った時点で、利用者と私個人（アプリ制作者）との間で、本規約の諸規定に従った利用契約が成立するものとします。
          <br />
          ３ 利用者が未成年者である場合には、親権者その他の法定代理人の同意を得たうえで、本サービスをご利用ください。
          <br />
          ４
          未成年者の利用者が、法定代理人の同意がないにもかかわらず同意があると偽りまたは年齢について成年と偽って本サービスを利用した場合、その他行為能力者であることを信じさせるために詐術を用いて本サービスを利用した場合、本サービスに関する一切の法律行為は取り消しできません。
          <br />
          ５
          未成年者が本サービスを利用するにあたっては、法定代理人を含む利用者の責任において、本サービスの内容を十分に理解した上で本サービスを利用するものとします。
          <br />６ 利用者が利用登録をした場合、利用者は、利用登録の時点で本利用規約に同意したものとみなします。
        </Text>
        <Heading size="md" mb={2}>
          第３条（利用登録）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          本サービスの利用を希望する者（以下「登録希望者」といいます。）は、私個人（アプリ制作者）の定める方法により、利用登録を申請するものとします。
          <br />
          ２
          私個人（アプリ制作者）は、登録希望者が以下の各号のいずれかに該当する場合、利用登録を拒否することがあります。
          <br />
          （1）登録希望者が、本規約に違反したことがある者であることが判明した場合
          <br />
          （2）登録希望者が、その他私個人（アプリ制作者）が利用登録を適当でないと判断した場合
          <br />
          ３ 利用登録の承認は、私個人（アプリ制作者）が登録希望者に通知した時点をもって効力を生じるものとします。
          <br />４
          利用登録が効力を生じたことにより、登録希望者は利用者となり、私個人（アプリ制作者）が提供する本サービスを、本規約の定めに従って利用することができるようになります。
        </Text>
        <Heading size="md" mb={2}>
          第４条（ユーザーID及びパスワードの管理）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          利用者は、自己の責任において、ユーザーID及びパスワードを管理及び保管するものとし、これを第三者に利用させ、または貸与、譲渡、名義変更、売買などをしてはならないものとします。
          <br />２
          ユーザーID及びパスワードの管理不十分、使用上の過誤、第三者の使用等によって生じた損害について、私個人（アプリ制作者）は一切の責任を負いません。
        </Text>
        <Heading size="md" mb={2}>
          第５条（利用料金及び支払方法）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          利用者は、本サービスの利用にあたり、私個人（アプリ制作者）が別途定め、本サイトに表示する利用料金を、私個人（アプリ制作者）が指定する方法により支払うものとします。
          <br />２
          利用者が利用料金の支払を遅滞した場合、利用者は、年間14.6％の割合による遅延損害金を支払うものとします。
        </Text>
        <Heading size="md" mb={2}>
          第６条（禁止事項）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          本サービスの利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
          <br />
          （1）法令または公序良俗に違反する行為
          <br />
          （2）犯罪行為に関連する行為
          <br />
          （3）私個人（アプリ制作者）のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
          <br />
          （4）私個人（アプリ制作者）のサービスの運営を妨害するおそれのある行為
          <br />
          （5）他の利用者に対する嫌がらせ
          <br />
          （6）本サービスに関連して、他の利用者に不利益、損害、不快感を与える行為
          <br />
          （7）他の利用者の情報等をコレクトまたは蓄積する行為
          <br />
          （8）不正アクセスをし、またはこれを試みる行為
          <br />
          （9）ダブルポスト（同一の内容を複数回投稿すること）や、不適切なキーワードを連投する行為
          <br />
          （10）私個人（アプリ制作者）、他の利用者、その他の第三者に対する詐欺または脅迫行為
          <br />
          （11）有害なコンピュータプログラム、メール等を送信または書き込みをする行為
          <br />
          （12）私個人（アプリ制作者）、他の利用者、その他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利または利益を侵害する行為
          <br />
          （13）その他、私個人（アプリ制作者）が不適切と判断する行為
        </Text>
        <Heading size="md" mb={2}>
          第７条（本サービスの提供の停止等）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          私個人（アプリ制作者）は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
          <br />
          （1）本サービスにかかるコンピューターシステムの保守点検または更新を行う場合
          <br />
          （2）火災、停電、天災地変等の非常事態により本サービスの提供が困難な場合
          <br />
          （3）コンピューターまたは通信回線等が事故により停止した場合
          <br />
          （4）その他、私個人（アプリ制作者）が本サービスの提供が困難と判断した場合
          <br />２
          私個人（アプリ制作者）は、本サービスの提供の停止または中断により、利用者または第三者が被ったいかなる損害についても、理由を問わず一切の責任を負わないものとします。
        </Text>
        <Heading size="md" mb={2}>
          第８条（利用契約の解除等）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          私個人（アプリ制作者）は、利用者が以下の各号のいずれかに該当する場合、事前の通知なくして利用契約を解除し、または本サービスの利用を一時停止することができるものとします。
          <br />
          （1）利用料金等の支払債務の不履行があった場合
          <br />
          （2）本規約のいずれかの条項に違反した場合
          <br />
          （3）その他、私個人（アプリ制作者）が本サービスの利用を適当でないと判断した場合
          <br />
          ２
          前各号のいずれかに該当した場合、利用者は、当然に私個人（アプリ制作者）に対して、当該利用者の利用する本サービスに関連して生じた一切の債務について期限の利益を失うものとします。
          <br />３
          私個人（アプリ制作者）の前各号に基づく利用契約の解除、または本サービスの利用の一時停止により、利用者または第三者が被ったいかなる損害についても、理由を問わず一切の責任を負わないものとします。
        </Text>
        <Heading size="md" mb={2}>
          第９条（保証の否認及び免責事項）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １
          私個人（アプリ制作者）は、本サービスに関して、特定の目的への適合性、完全性、確実性、安全性、合法性、最新性及び無違反性について、明示または黙示を問わず、何ら保証しません。
          <br />
          ２
          私個人（アプリ制作者）は、本サービスに起因して利用者に生じたあらゆる損害について、一切の責任を負いません。ただし、本サービスの利用契約（これに関連する契約を含みます。以下本条において同じ。）が消費者契約法第2条第3項に定義される消費者契約となる場合、この免責規定は適用しません。
          <br />３
          前項の場合、私個人（アプリ制作者）は、過失による場合に限り、利用者が本サービスの利用により被った通常の損害についての責任を負います。ただし、この損害賠償の責任は、利用者からの当該損害が発生した月に受領した利用料金の額を上限とします。
        </Text>
        <Heading size="md" mb={2}>
          第１０条（サービス内容の変更等）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          私個人（アプリ制作者）は、利用者に通知することなく、本サービスの内容を変更し、または本サービスの提供を中止することができるものとし、これによって利用者または第三者が被ったいかなる損害についても、一切の責任を負わないものとします。
        </Text>
        <Heading size="md" mb={2}>
          第１１条（利用者による本サービスの利用停止・解除）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          利用者は、私個人（アプリ制作者）に対し、何らの手続きをすることなく、本サービスの利用を停止または利用契約を解除することができます。
        </Text>
        <Heading size="md" mb={2}>
          第１２条（個人情報の取扱い）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          私個人（アプリ制作者）は、本サービスにおいて利用者から取得した個人情報について、適切に取り扱うものとします。
        </Text>
        <Heading size="md" mb={2}>
          第１３条（通知または連絡）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          利用者と私個人（アプリ制作者）との間の通知または連絡は、私個人（アプリ制作者）の定める方法によって行うものとします。私個人（アプリ制作者）は、利用者から、私個人（アプリ制作者）が別途定める連絡先に対して電子メールその他の通信手段による連絡がない場合、利用者が登録した連絡先に対して通知または連絡を行ったものとみなします。
        </Text>
        <Heading size="md" mb={2}>
          第１４条（利用契約上の地位の譲渡等）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          利用者は、私個人（アプリ制作者）の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利義務の全部または一部を第三者に譲渡、担保設定またはその他の処分をすることはできません。
        </Text>
        <Heading size="md" mb={2}>
          第１５条（準拠法・裁判管轄）
        </Heading>
        <Text mb={5} fontSize={textFontSize}>
          １ 本規約の解釈にあたっては、日本法を準拠法とします。
          <br />２
          本サービスに関して紛争が生じた場合には、私個人（アプリ制作者）の本店所在地を管轄する裁判所を専属的合意管轄とします。
        </Text>
        <Text mb={5}>以上</Text>
      </VStack>
    </Box>
  );
});
