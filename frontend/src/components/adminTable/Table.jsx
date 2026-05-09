const Table = ({ headers, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                        {headers.map((head, index) => (
                            <th key={index} className="p-5">
                                {head}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">{children}</tbody>
            </table>
        </div>
    </div>
);
export default Table;
