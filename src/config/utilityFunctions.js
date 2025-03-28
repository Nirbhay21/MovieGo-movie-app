export const selectQueryResults = () => (dataKey) => {
    const loadingKey = "is" + dataKey.charAt(0).toUpperCase() + dataKey.slice(1) + "Loading";
    const successKey = "is" + dataKey.charAt(0).toUpperCase() + dataKey.slice(1) + "Success";
    const errorKey = "is" + dataKey.charAt(0).toUpperCase() + dataKey.slice(1) + "Error";
    const error = dataKey + "Error";

    return {
        selectFromResult: (response) => ({
            [dataKey]: response?.data?.results,
            [successKey]: response.isSuccess,
            [loadingKey]: response.isLoading,
            [errorKey]: response.isError,
            [error]: response.error,
            ...response
        })
    }
}

export const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Function to get ordinal suffix
    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // Covers 11th to 19th
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

export const getSkeletonCardsCount = () => {
    if (window.innerWidth < 425) return 6;
    if (window.innerWidth < 768) return 8;
    if (window.innerWidth < 1440) return 15;
    return 18;
};
