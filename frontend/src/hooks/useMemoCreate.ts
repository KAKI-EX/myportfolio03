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
      expiry_date_start, // eslint-disable-line
      expiry_date_end, // eslint-disable-line
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
            memos: (formData.listForm || []).map((data: ListFormParams) => {
              return {
                user_id,
                shop_id,
                shopping_datum_id,
                purchase_name: data.purchase_name,
                price: data.price,
                shopping_detail_memo: data.shopping_detail_memo,
                amount: data.amount,
                shopping_date,
                expiry_date_start: data.expiry_date_start,
                expiry_date_end: data.expiry_date_end,
              };
            }),
          };
          const memosCreateRes = await memosCreate(memosParams.memos);
          history.push("/okaimono");
          if (formData.listForm) {
            showMessage({ title: `${memosCreateRes.data.length}件のメモを登録しました`, status: "success" });
          }
        }
      }
    } catch (err: any) {
      showMessage({ title: err.response.data.errors, status: "error" });
      console.error(err.response);
      console.log(err.response.data.error);
    }
    setLoading(false);
  };
  return sendDataToAPI;
};
