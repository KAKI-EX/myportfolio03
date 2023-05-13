import { ListFormParams, MergeParams } from "interfaces";
import { memosCreate, shopCreate, shoppingDatumCreate } from "lib/api/post";
import React from "react";
import { useHistory } from "react-router-dom";
import { useCookie } from "./useCookie";
import { useMessage } from "./useToast";

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  total_budget: number; // eslint-disable-line
};

export const useMemoCreate = (props: Props) => {
  console.log("カスタムフックuseMemoCreateが走っています");

  const { separateCookies } = useCookie();
  const history = useHistory();
  const { showMessage } = useMessage();

  const { setLoading, total_budget } = props; // eslint-disable-line

  const sendDataToAPI = async (formData: MergeParams) => {
    console.log("カスタムフックsendDataToAPIが走っています");

    const user_id = separateCookies("_user_id"); // eslint-disable-line
    const {
      shop_name, // eslint-disable-line
      shopping_date, // eslint-disable-line
      shopping_memo, // eslint-disable-line
      estimated_budget, // eslint-disable-line
    } = formData; // eslint-disable-line
    const shopParams: MergeParams = { user_id, shop_name: shop_name || "お店名称未設定でのお買い物" }; // eslint-disable-line

    try {
      setLoading(true);
      const shopCreateRes = await shopCreate(shopParams);
      if (shopCreateRes.status === 200) {
        const shop_id = shopCreateRes.data.id; // eslint-disable-line
        const shoppingDataParams: MergeParams = {
          user_id,
          shop_id,
          shopping_date,
          shopping_memo,
          estimated_budget,
          total_budget,
        };
        const shoppingDatumCreateRes = await shoppingDatumCreate(shoppingDataParams);
        if (shoppingDatumCreateRes.status === 200) {
          const shopping_datum_id = shoppingDatumCreateRes.data.id; // eslint-disable-line
          const memosParams = {
            memos: (formData.listForm || []).map((test: ListFormParams) => {
              return {
                user_id,
                shop_id,
                shopping_datum_id,
                purchase_name: test.purchase_name,
                price: test.price,
                shopping_detail_memo: test.shopping_detail_memo,
                amount: test.amount,
                shopping_date,
              };
            }),
          };

          const memosCreateRes = await memosCreate(memosParams.memos);
          console.log("Memoのレスポンス", memosCreateRes);
          history.push("/okaimono");
          if (formData.listForm) {
            showMessage({ title: `${memosCreateRes.data.length}件のメモを登録しました`, status: "success" });
          }
        }
      }
    } catch (err: any) {
      showMessage({ title: err.response.data.error, status: "error" });
      console.error(err.response);
      console.log(err.response.data.error);
    }
    setLoading(false);
  };
  return sendDataToAPI;
};
