// When Goald respond with 1 business object
interface singleGoaldResponse<ObjectType> {
    Object: ObjectType;
    StatusCode: number;
    Status: string;
    Message: string;
}

// This function allows to post data to a given URL, then set the result within the caller's context using the given state setter
export const postFormValuesAndSetResult = async <InputType, ResultType>(
    path: string,
    data: InputType,
    setResult: React.Dispatch<React.SetStateAction<ResultType | undefined>>,
    failIfNotOK: boolean,
) => {
    try {
        // starting fresh
        setResult(undefined);

        // HTTP calling
        const response = await fetch(import.meta.env.WEB_API_URL + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // reading the response
        const result =
            (await response.json()) as singleGoaldResponse<ResultType>;

        // something not cool happened
        if (!response.ok && failIfNotOK) {
            throw new Error(
                "Error " +
                    result.StatusCode +
                    " (" +
                    result.Status +
                    "): " +
                    result.Message,
            );
        }

        // we're good, let's set the result
        if (response.ok) {
            setResult(result.Object as ResultType);
        } else {
            setResult({} as ResultType);
        }
    } catch (error) {
        // just logging for now...
        console.error(error);
    }
};
